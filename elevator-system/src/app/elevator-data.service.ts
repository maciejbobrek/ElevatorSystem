
import { Injectable } from '@angular/core';
import { Elevator } from './elevator.types';
import { Person } from './person.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElevatorDataService {
  private elevatorsSubject = new BehaviorSubject<Elevator[]>([]);

  elevators$ = this.elevatorsSubject.asObservable();
  constructor() { }

  createElevator(): void {
    const currentElevators = this.elevatorsSubject.getValue();
    const newElevator: Elevator = {
      id: currentElevators.length + 1,
      currentFloor: 0,
      targetFloor: 0,
      queue: [],
      inside: []
    };

    currentElevators.push(newElevator);
    this.notifyDataChange(currentElevators);
  }
  addToQueue(id: number, person: Person): void {
    const currentElevators = this.elevatorsSubject.getValue();
    const elevatorIndex = currentElevators.findIndex(e => e.id === id);

    if (elevatorIndex !== -1) {
      const updatedElevators = [...currentElevators];
      updatedElevators[elevatorIndex].queue.push(person);

      this.notifyDataChange(updatedElevators);
    } else {
      console.error(`Winda o ID ${id} nie została znaleziona.`);
    }
  }
  private notifyDataChange(updatedElevators: Elevator[]): void {
    this.elevatorsSubject.next(updatedElevators);
  }
  calculateTargetFloor(elevator: Elevator): number | null {
    if (elevator.inside.length == 0 && elevator.queue.length > 0) {
      return elevator.queue[0].waitingFloor;
    }
    else if (elevator.queue.length == 0 && elevator.inside.length > 0) {
      return elevator.inside[0].targetFloor;
    }

    return null;
  }
  updateTargetFloor(id: number): void {
    const currentElevators = this.elevatorsSubject.getValue();
    const elevatorIndex = currentElevators.findIndex(e => e.id === id);

    if (elevatorIndex !== -1) {
      const updatedElevators = [...currentElevators];
      const elevator = updatedElevators[elevatorIndex];

      const newTargetFloor = this.calculateTargetFloor(elevator);

      if (newTargetFloor !== null) {
        elevator.targetFloor = newTargetFloor;
      }
      this.notifyDataChange(updatedElevators);
    } else {
      console.error(`Winda o ID ${id} nie została znaleziona.`);
    }
  }
  observeElevatorChanges(callback: (elevators: Elevator[]) => void): void {
    this.elevators$.subscribe(callback);
  }
  simulateStep(id: number) {
    const currentElevators = this.elevatorsSubject.getValue();
    const elevatorIndex = currentElevators.findIndex(e => e.id === id);
    
    if (elevatorIndex !== -1) {
      const updatedElevators = [...currentElevators];
      const elevator = updatedElevators[elevatorIndex];
      const hoppingInPeople=this.hoppingIn(elevator)
      const hoppingOffPeople=this.hoppingOff(elevator)
      if (hoppingInPeople) {
        elevator.inside.push(...hoppingInPeople);
        elevator.queue = elevator.queue.filter(person => !hoppingInPeople.some(p => p.id === person.id));
        this.updateTargetFloor(elevator.id)
      }
      else if (hoppingOffPeople) {
        elevator.inside = elevator.inside.filter(person => !hoppingOffPeople.some(p => p.id === person.id));
        this.updateTargetFloor(elevator.id)
      }
      else{
        const NextFloor= this.calculateNextFloor(elevator)
        if(NextFloor !== null){
        elevator.currentFloor = NextFloor;
        }
      }
      this.notifyDataChange(updatedElevators);
    } else {
      console.error(`Winda o ID ${id} nie została znaleziona.`);
    }
  }
  calculateNextFloor(elevator: Elevator): number | null {
    if (elevator.targetFloor<elevator.currentFloor) {
      return elevator.currentFloor-1;
    }
    else {
      return elevator.currentFloor+1;
    }
  }
  hoppingOff(elevator:Elevator):Array<Person>|null{
    const currentFloor = elevator.currentFloor;

    const personsGettingOff = elevator.inside.filter(person => person.targetFloor === currentFloor);
  
    return personsGettingOff.length > 0 ? personsGettingOff : null;

  }
  hoppingIn(elevator:Elevator):Array<Person>|null{
    const currentFloor = elevator.currentFloor;

    const personsGettingOff = elevator.queue.filter(person => person.waitingFloor === currentFloor);
  
    return personsGettingOff.length > 0 ? personsGettingOff : null;
  }
}