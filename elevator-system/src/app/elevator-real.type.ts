
export interface Pickup {
  currentFloor: number;
  up: boolean;
}

export interface ElevatorWithoutPeople {
    id: number;
    currentFloor: number;
    targetFloor: number;
    pickups: Array<Pickup>;
    target: Set<number>;
  }