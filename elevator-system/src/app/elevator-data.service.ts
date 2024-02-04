
import { Injectable } from '@angular/core';
import { Elevator } from './elevator.types';
import { Person } from './person.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElevatorDataService {
  private elevatorsSubject = new BehaviorSubject<Elevator[]>([]);
  private floors = 10;
  private floor_limit = 3; //max amount of people in queue on one floor
  private max_elevators = 16;
  private max_people_inside = 9;
  elevators$ = this.elevatorsSubject.asObservable();
  constructor() { }

  createElevator(): void {
    if (this.elevatorsSubject.getValue().length < 15) {
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
    else {
      console.log("maximum number of elevators:" + this.max_elevators + " reached");
    }
  }
  getFloors() {
    return this.floors;
  }
  addToQueue(id: number, person: Person): void {
    const currentElevators = this.elevatorsSubject.getValue();
    const elevatorIndex = currentElevators.findIndex(e => e.id === id);
    let peopleOnfloor = this.hoppingIn(currentElevators[elevatorIndex], person.waitingFloor)
    if (elevatorIndex !== -1 && (peopleOnfloor == null || peopleOnfloor.length < this.floor_limit)) {
      const updatedElevators = [...currentElevators];
      updatedElevators[elevatorIndex].queue.push(person);

      this.notifyDataChange(updatedElevators);
    } else {
      console.error(`Osiągnięto max ilość osob czekających na piętrze`);
    }
  }
  private notifyDataChange(updatedElevators: Elevator[]): void {
    this.elevatorsSubject.next(updatedElevators);
  }
  calculateTargetFloor(elevator: Elevator): number | null {
    if (elevator.inside.length == 0 && elevator.queue.length == 0) {
      return 0;
    }
    else if (elevator.inside.length == 0 && elevator.queue.length > 0) {
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
      const hoppingInPeople = this.hoppingIn(elevator, elevator.currentFloor)
      const hoppingOffPeople = this.hoppingOff(elevator, elevator.currentFloor)
      if (hoppingInPeople) {
        elevator.inside.push(...hoppingInPeople);
        elevator.queue = elevator.queue.filter(person => !hoppingInPeople.some(p => p.id === person.id));
        console.log("Going In" + hoppingInPeople)
        this.updateTargetFloor(elevator.id)
      }
      else if (hoppingOffPeople) {
        elevator.inside = elevator.inside.filter(person => !hoppingOffPeople.some(p => p.id === person.id));
        console.log("hopping Off" + hoppingOffPeople)
        this.updateTargetFloor(elevator.id)
      }
      else {
        const NextFloor = this.calculateNextFloor(elevator)
        if (NextFloor !== null) {
          elevator.currentFloor = NextFloor;
        }
      }
      this.notifyDataChange(updatedElevators);
    } else {
      console.error(`Winda o ID ${id} nie została znaleziona.`);
    }
  }
  calculateNextFloor(elevator: Elevator): number | null {
    console.log(elevator.targetFloor);
    console.log(elevator.currentFloor);
    if (elevator.targetFloor == elevator.currentFloor) {
      return elevator.currentFloor;
    }
    else if (elevator.targetFloor < elevator.currentFloor) {
      return elevator.currentFloor - 1;
    }
    else {
      return elevator.currentFloor + 1;
    }
  }
  hoppingOff(elevator: Elevator, n: number): Array<Person> | null {
    const currentFloor = n;

    const personsGettingOff = elevator.inside.filter(person => person.targetFloor === currentFloor);
    return personsGettingOff.length > 0 ? personsGettingOff : null;

  }
  hoppingIn(elevator: Elevator, n: number): Array<Person> | null {
    const currentFloor = n;

    const personsGettingOff = elevator.queue.filter(person => person.waitingFloor === currentFloor);

    return personsGettingOff.length > 0 ? personsGettingOff : null;
  }
  SomeOneUp(elevator: Elevator, n: number): boolean {
    const queue = elevator.queue.filter(person => person.waitingFloor === n)
    let isTargetHigherIn = false;
    if (queue != null ) {
      isTargetHigherIn = queue.some(person => person.targetFloor > person.waitingFloor);
    }
    return isTargetHigherIn;
  }
  SomeOneDown(elevator: Elevator, n: number): boolean {
    const queue = elevator.queue.filter(person => person.waitingFloor === n)
    let isTargetLowerIn = false;
    if (queue != null ) {
      isTargetLowerIn = queue.some(person => person.targetFloor < person.waitingFloor);
    }
    return isTargetLowerIn;
  }
}