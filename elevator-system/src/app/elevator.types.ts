import { Person } from './person.type';

export interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number;
    queue: Array<Person>;
    inside: Array<Person>;
  }