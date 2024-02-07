import { Injectable } from '@angular/core';
import { ElevatorWithoutPeople, Pickup} from './elevator-real.type';
import { BehaviorSubject, map, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import  realData  from './assets/real-data.json';

@Injectable({
  providedIn: 'root'
})
export class ElevatorRealDataService {
  private elevatorsSubject = new BehaviorSubject<ElevatorWithoutPeople[]>([]);
  private floors = 10;
  private max_elevators = 16;

  elevators$ = this.elevatorsSubject.asObservable();
  constructor() { 
    this.loadElevators();
  }

  createElevator(): void {
    if (this.elevatorsSubject.getValue().length < 15) {
      const currentElevators = this.elevatorsSubject.getValue();
      const newElevator: ElevatorWithoutPeople = {
        id: currentElevators.length + 1,
        currentFloor: 0,
        targetFloor: 0,
        pickups: [],
        target:  new Set<number>()
      };
      currentElevators.push(newElevator);
      this.notifyDataChange(currentElevators);
      console.log("createdElevator");

    }
    else {
      console.log("maximum number of elevators:" + this.max_elevators + " reached");
    }
  }
  deleteElevator(elevatorId: number): void {
    const currentElevators = this.elevatorsSubject.getValue();
    const updatedElevators = currentElevators.filter(elevator => elevator.id !== elevatorId);
    this.notifyDataChange(updatedElevators);
  }
  private notifyDataChange(updatedElevators: ElevatorWithoutPeople[]): void {
    this.elevatorsSubject.next(updatedElevators);
  }
  loadElevators(): void {
    const elevatorsData: ElevatorWithoutPeople[] = realData.map(elevator => ({
      ...elevator,
      target: new Set(elevator.target)
    }));
    this.elevatorsSubject.next(elevatorsData);
  }
  addRequest(id:number,pickup:Pickup){
    const currentElevators = this.elevatorsSubject.getValue();
    const elevatorIndex = currentElevators.findIndex(e => e.id === id);
    if (elevatorIndex !== -1 && !currentElevators[elevatorIndex].pickups.some(check=>(check.currentFloor==pickup.currentFloor && check.up==pickup.up))) {
      const updatedElevators = [...currentElevators];
      updatedElevators[elevatorIndex].pickups.push(pickup);
      console.log("request added")
      this.notifyDataChange(updatedElevators);
      this.updateTargetFloor(id)
    } else {
      console.error(`Osiągnięto max ilość osob czekających na piętrze`);
    }
  }
  getFloors() {
    return this.floors;
  }
  addToTargets(elevator: ElevatorWithoutPeople,n:number){
    elevator.target.add(n);
    this.updateTargetFloor(elevator.id)
  }
  checkIfInTargets(elevator: ElevatorWithoutPeople,n:number):boolean{
    return elevator.target.has(n);
  }
  simulateStep(id: number) {
    const currentElevators = this.elevatorsSubject.getValue();
    const elevatorIndex = currentElevators.findIndex(e => e.id === id);
    if (elevatorIndex !== -1) {
      const updatedElevators = [...currentElevators];
      const elevator = updatedElevators[elevatorIndex];
      const requestsOnFloor = elevator.pickups.filter(pickup => pickup.currentFloor==elevator.currentFloor)
      console.log(requestsOnFloor)
    if (requestsOnFloor.length>0) {
        let requestsWithDirection=requestsOnFloor.filter(request=>(request.up==this.isGoingUp(elevator.currentFloor,elevator.targetFloor)||elevator.currentFloor==elevator.targetFloor))
        console.log("requestsWithDirection"+requestsWithDirection.length)
        requestsWithDirection.forEach(request => {
          elevator.target.add(request.currentFloor);
      });
      elevator.pickups = elevator.pickups.filter(check => !requestsWithDirection.some(p => (p.up === check.up && p.currentFloor===check.currentFloor)));
      this.updateTargetFloor(elevator.id)
      }
    if (elevator.target.has(elevator.currentFloor)){
      elevator.target.delete(elevator.currentFloor)
      this.updateTargetFloor(elevator.id)
    }
    else if(true){
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
  calculateTargetFloor(elevator: ElevatorWithoutPeople): number | null {
    let wasgoingup=false;
    let isLiftGoingUp=this.isGoingUp(elevator.currentFloor,elevator.targetFloor);
    const maxTargetFloor = Math.max(...elevator.target,...elevator.pickups.map(pickup=>pickup.currentFloor));
    const minTargetFloor =Math.min(...elevator.target,...elevator.pickups.map(pickup=>pickup.currentFloor));
    // console.log("max"+maxTargetFloor)
    // console.log("min"+minTargetFloor)
    // console.log("isgoingup"+isLiftGoingUp)
    if (elevator.target.size==0&&elevator.pickups.length==0) {
      return elevator.currentFloor;
    }    
    else if (elevator.targetFloor==elevator.currentFloor&&(maxTargetFloor<elevator.currentFloor||minTargetFloor<elevator.currentFloor&&wasgoingup)){
      return minTargetFloor;
    }
    else if (elevator.targetFloor==elevator.currentFloor&&(minTargetFloor>elevator.currentFloor||maxTargetFloor>elevator.currentFloor&&!wasgoingup)) {
      return maxTargetFloor;
    }
    else if (elevator.targetFloor != elevator.currentFloor &&isLiftGoingUp) {
      return maxTargetFloor;
    }
    else if (elevator.targetFloor != elevator.currentFloor &&!isLiftGoingUp) {
      return minTargetFloor;
    }
    wasgoingup=isLiftGoingUp;
    return elevator.currentFloor;
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
  calculateNextFloor(elevator: ElevatorWithoutPeople): number | null {
    if (elevator.targetFloor < elevator.currentFloor && elevator.currentFloor>0) {
      return elevator.currentFloor - 1;
    }
    else if(elevator.targetFloor > elevator.currentFloor && elevator.currentFloor<this.max_elevators)  {
      return elevator.currentFloor + 1;
    }
    return elevator.currentFloor;
  }

}