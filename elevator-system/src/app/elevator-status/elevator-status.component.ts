import { Elevator } from '../elevator.type';
import { Component, OnInit } from '@angular/core';
import { ElevatorDataService } from '../elevator-data.service';

@Component({
  selector: 'app-elevator-status',
  templateUrl: './elevator-status.component.html',
  styleUrl: './elevator-status.component.css'
})
export class ElevatorStatusComponent implements OnInit {
  elevators:any;
  constructor(private elevatorDataService: ElevatorDataService) { }

  ngOnInit() {
    this.elevatorDataService.elevators$.subscribe((elevators) => {
      this.elevators = elevators
    }
    );
  }
}