// elevator.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ElevatorDataService } from '../elevator-data.service';
import { Elevator } from '../elevator.type';
import { Person } from '../person.type';
@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html',
  styleUrl: './elevator.component.css'
})
export class ElevatorComponent implements OnInit {
  @Input()
  elevator!: Elevator;
  elevators: Elevator[] = [];
  constructor(private elevatorDataService: ElevatorDataService) {}

  ngOnInit():void {
      this.elevatorDataService.elevators$.subscribe((elevators) => {
        this.elevators = elevators
      }
      );
    }

  simulateStep() {
    this.elevatorDataService.simulateStep(this.elevator.id);
  } 
  addToQueueFromFloor(n:number,down:boolean){
   let waiting=n;
   let target=waiting;
    while(target==waiting){
      if(down){
      target=this.getRandomInt(0,n);
      }
      else{
        target=this.getRandomInt(n,this.elevatorDataService.getFloors());
      }
    }
    const newPerson:Person ={
        id:this.elevator.queue.length+this.elevator.inside.length,
        targetFloor: target,
        waitingFloor: waiting
    };
    this.elevatorDataService.addToQueue(this.elevator.id,newPerson)
    this.elevatorDataService.updateTargetFloor(this.elevator.id);
  }
  addToQueue(){
    let waiting=this.getRandomInt(0,this.elevatorDataService.getFloors());
    let target=waiting;
    while(target==waiting){
      target=this.getRandomInt(0,this.elevatorDataService.getFloors());
    }
    const newPerson:Person ={
        id:this.elevator.queue.length+this.elevator.inside.length,
        targetFloor: target,
        waitingFloor: waiting
    };
    this.elevatorDataService.addToQueue(this.elevator.id,newPerson)
    this.elevatorDataService.updateTargetFloor(this.elevator.id);
  }
  getRandomInt(min:number,max:number) {
    return Math.floor(min+ Math.random() * (max-min));
  }
  getFloorsArray(): number[] {
    let n = this.elevatorDataService.getFloors();
    return Array.from({ length: n }, (_, index) => n - 1 - index);
  }
  getFloors(): number {
    let n=this.elevatorDataService.getFloors();
    return n;
  }
  getPeopleOnFloor(n:number): Array<Person>|null{
      return this.elevatorDataService.hoppingIn(this.elevator,n);
  }
  SomeOneUp(n:number):boolean{
    return this.elevatorDataService.SomeOneUp(this.elevator,n);
  }
  SomeOneDown(n:number):boolean{
    return this.elevatorDataService.SomeOneDown(this.elevator,n);
  }
}