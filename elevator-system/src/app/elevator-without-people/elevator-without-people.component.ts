import { Component, Input } from '@angular/core';
import { ElevatorWithoutPeople, Pickup } from '../elevator-real.type';
import { ElevatorRealDataService } from '../elevator-real-data.service';

@Component({
  selector: 'app-elevator-without-people',
  templateUrl: './elevator-without-people.component.html',
  styleUrl: './elevator-without-people.component.css'
})
export class ElevatorWithoutPeopleComponent {
  @Input()
  elevator!: ElevatorWithoutPeople;
  elevators: ElevatorWithoutPeople[] = [];
  constructor(private elevatorDataService: ElevatorRealDataService) { }

  ngOnInit(): void {
    this.elevatorDataService.elevators$.subscribe((elevators) => {
      this.elevators = elevators
    }
    );
  }
  getFloorsArray(): number[] {
    let n = this.elevatorDataService.getFloors();
    return Array.from({ length: n }, (_, index) => n - 1 - index);
  }
  simulateStep() {
    this.elevatorDataService.simulateStep(this.elevator.id);
  } 
  getFloors(): number {
    let n=this.elevatorDataService.getFloors();
    return n;
  }
  addRequest(current:number,up:boolean){
    const newPickup:Pickup ={
      currentFloor: current,
      up: up
  };
    this.elevatorDataService.addRequest(this.elevator.id,newPickup);
  }
  isthereRequest(current:number,dest:boolean): boolean{
    let requests=this.elevator.pickups.filter(pickup => pickup.currentFloor==current&&pickup.up==dest)
    return requests.length>0
  }
  addToTargets(n:number){
    this.elevatorDataService.addToTargets(this.elevator,n);
  }
  checkIfInTargets(n:number):boolean{
    return this.elevatorDataService.checkIfInTargets(this.elevator,n);
  }
  deleteElevator(){
    this.elevatorDataService.deleteElevator(this.elevator.id)
  }
}
