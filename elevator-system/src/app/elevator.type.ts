export interface Person{
  id: number;
  waitingFloor: number;
  targetFloor: number;
}
export interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number;
    queue: Array<Person>;
    inside: Array<Person>;
  }