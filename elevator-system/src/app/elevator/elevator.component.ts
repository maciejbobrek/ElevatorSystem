// elevator.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ElevatorDataService } from '../elevator-data.service';
import { Elevator } from '../elevator.types';
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
  addToQueue(){
    let target=this.getRandomInt(5);
    let waiting=this.getRandomInt(5);
    const newPerson:Person ={
        id:this.elevator.queue.length+this.elevator.inside.length,
        targetFloor: target,
        waitingFloor: waiting
    };
    this.elevatorDataService.addToQueue(this.elevator.id,newPerson)
    this.elevatorDataService.updateTargetFloor(this.elevator.id);
  }
  getRandomInt(max:number) {
    return Math.floor(Math.random() * max);
  }
  
}