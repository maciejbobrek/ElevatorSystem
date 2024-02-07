import { Component } from '@angular/core';
import { ElevatorDataService } from './elevator-data.service';
import { ElevatorRealDataService } from './elevator-real-data.service';
import { skip } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'elevator-system';
  elevators:any;
  elevators_without:any;
  intervalId: any = null;
  isRunning: boolean = false;
  constructor(private elevatorDataService: ElevatorDataService,private elevatorWithoutPeopleDataService: ElevatorRealDataService) {
    this.elevatorDataService.elevators$.subscribe((elevators) => {
      this.elevators = elevators
    }
    );
    this.elevatorWithoutPeopleDataService.elevators$.subscribe((elevators_without) => {
      this.elevators_without = elevators_without
    }
    );
  }
  addElevator() {
    this.elevatorDataService.createElevator();
  }
  addElevatorWithoutPeople(){
    this.elevatorWithoutPeopleDataService.createElevator();
  }
  simulateAll(){
    for (var elevator of this.elevators){
      this.elevatorDataService.simulateStep(elevator.id);
    }
    for (var elevator of this.elevators_without){
      this.elevatorWithoutPeopleDataService.simulateStep(elevator.id)
    }
  }
  startSimulation() {
    if (!this.isRunning) {
      this.intervalId = setInterval(() => {
        this.simulateAll()
      }, 1500); 
      this.isRunning = true;
    }
  }

  stopSimulation() {
    if (this.isRunning) {
      clearInterval(this.intervalId);
      this.isRunning = false;
    }
  }
  toggleSimulation() {
    if (this.isRunning) {
      this.stopSimulation();
    } else {
      this.startSimulation();
    }
  }
}
