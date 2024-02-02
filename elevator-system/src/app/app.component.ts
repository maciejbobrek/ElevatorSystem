import { Component } from '@angular/core';
import { ElevatorDataService } from './elevator-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'elevator-system';
  elevators:any;

  constructor(private elevatorDataService: ElevatorDataService) {
    this.elevatorDataService.elevators$.subscribe((elevators) => {
      this.elevators = elevators
    }
    );
  }
  addElevator() {
    this.elevatorDataService.createElevator();
  }
}
