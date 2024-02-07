
import { Injectable } from '@angular/core';
import { Elevator, Person } from './elevator.type';
import { BehaviorSubject, max } from 'rxjs';
import  peopleData  from './assets/people-data.json';

@Injectable({
  providedIn: 'root'
})
export class ElevatorDataService {
  private elevatorsSubject = new BehaviorSubject<Elevator[]>([]);
  private floors = 10;
  private floor_limit = 2; //max amount of people in queue on one floor
  private max_elevators = 16;
  private max_people_inside = 9; // max amount of people inside of elevator
  elevators$ = this.elevatorsSubject.asObservable();
  constructor() { this.loadElevators()}

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
  loadElevators(): void {
    const elevatorsData: Elevator[] = peopleData.map(elevator => ({
      id: elevator.id,
      currentFloor: elevator.currentFloor,
      targetFloor: elevator.targetFloor,
      queue: elevator.queue,
      inside: elevator.inside
    }));
    this.elevatorsSubject.next(elevatorsData);
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
    let wasgoingup=false;
    let isLiftGoingUp=this.isGoingUp(elevator.currentFloor,elevator.targetFloor);
    const allPeople = [...elevator.queue, ...elevator.inside];
    const maxTargetFloor = Math.max(...elevator.inside.map(person => person.targetFloor),...elevator.queue.map(person => person.waitingFloor));
    const minTargetFloor =Math.min(...elevator.inside.map(person => person.targetFloor),...elevator.queue.map(person => person.waitingFloor));
    // console.log("max"+maxTargetFloor)
    // console.log("min"+minTargetFloor)
    // console.log("isgoingup"+isLiftGoingUp)
    if (elevator.inside.length == 0 && elevator.queue.length == 0) {
      return elevator.currentFloor;
    }    
    else if (elevator.targetFloor == elevator.currentFloor&&(maxTargetFloor<elevator.currentFloor||minTargetFloor<elevator.currentFloor&&wasgoingup)){
      return minTargetFloor;
    }
    else if (elevator.targetFloor == elevator.currentFloor&&(minTargetFloor>elevator.currentFloor||maxTargetFloor>elevator.currentFloor&&!wasgoingup)) {
      return maxTargetFloor;
    }
    else if (elevator.targetFloor != elevator.currentFloor && allPeople &&isLiftGoingUp) {
      return maxTargetFloor;
    }
    else if (elevator.targetFloor != elevator.currentFloor && allPeople &&!isLiftGoingUp) {
      return minTargetFloor;
    }
    wasgoingup=isLiftGoingUp;
    return null;
  }
  deleteElevator(elevatorId: number): void {
    const currentElevators = this.elevatorsSubject.getValue();
    const updatedElevators = currentElevators.filter(elevator => elevator.id !== elevatorId);
    this.notifyDataChange(updatedElevators);
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
      console.log(newTargetFloor)
      this.notifyDataChange(updatedElevators);
    } else {
      console.error(`Winda o ID ${id} nie została znaleziona.`);
    }
  }

  simulateStep(id: number) {
    const currentElevators = this.elevatorsSubject.getValue();
    const elevatorIndex = currentElevators.findIndex(e => e.id === id);

    if (elevatorIndex !== -1) {
      const updatedElevators = [...currentElevators];
      const elevator = updatedElevators[elevatorIndex];
      const hopppingWithDirection = this.hoppingWithDirection(elevator,elevator.currentFloor)
      const hoppingOffPeople = this.hoppingOff(elevator, elevator.currentFloor)
      console.log(hopppingWithDirection)
      if (hopppingWithDirection&&elevator.inside.length<this.max_people_inside) {
        elevator.inside.push(...hopppingWithDirection);
        elevator.queue = elevator.queue.filter(person => !hopppingWithDirection.some(p => p.id === person.id));
        console.log("in")
        this.updateTargetFloor(elevator.id)
      }
      if (hoppingOffPeople) {
        elevator.inside = elevator.inside.filter(person => !hoppingOffPeople.some(p => p.id === person.id));
        this.updateTargetFloor(elevator.id)
      }
      if((!hopppingWithDirection)||elevator.inside.length==this.max_people_inside){
        const NextFloor = this.calculateNextFloor(elevator)
        console.log("skip")
        if (NextFloor !== null) {
          elevator.currentFloor = NextFloor;
        }
      }
      this.notifyDataChange(updatedElevators);
    } else {
      console.error(`Winda o ID ${id} nie została znaleziona.`);
    }
  }
  isGoingUp(current:number,target:number): boolean{
    return current<target;
  }
  calculateNextFloor(elevator: Elevator): number | null {
    if (elevator.targetFloor < elevator.currentFloor) {
      return elevator.currentFloor - 1;
    }
    else if(elevator.targetFloor > elevator.currentFloor)  {
      return elevator.currentFloor + 1;
    }
    return elevator.currentFloor;
  }
  hoppingOff(elevator: Elevator, n: number): Array<Person> | null {
    const currentFloor = n;

    const personsGettingOff = elevator.inside.filter(person => person.targetFloor === currentFloor);
    return personsGettingOff.length > 0 ? personsGettingOff : null;

  }
  hoppingIn(elevator: Elevator, n: number): Array<Person> | null {
    const currentFloor = n;

    const personsGettingIN = elevator.queue.filter(person => person.waitingFloor === currentFloor);

    return personsGettingIN.length > 0 ? personsGettingIN : null;
  }
  hoppingWithDirection(elevator: Elevator, n: number): Array<Person> | null {
    const currentFloor = n;

    const personsGettingIN = elevator.queue.filter(person => person.waitingFloor === currentFloor);
    const peopleWithDirection=personsGettingIN?.filter(person => this.isGoingUp(person.waitingFloor,person.targetFloor)===this.isGoingUp(elevator.currentFloor,elevator.targetFloor)||person.waitingFloor===elevator.targetFloor);
    return peopleWithDirection.length > 0 ? peopleWithDirection : null;
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