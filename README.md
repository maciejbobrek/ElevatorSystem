# Elevator System
Elevator System to aplikacja Webowa napisana w Angularze. System posiada 2 komponenty i 2 serwisy
- elevator - odpowiada za model windy z ludźmi
- elevator-without-people - model windy bez ludzi
- elecator-data-service  - obsługa komponentu elevator
- elecator-real-data-service  - obsługa komponentu elevator-without-people

## Instalacja
In order to run software you need to first clone the repository
```
git clone https://github.com/maciejbobrek/ElevatorSystem.git
```
Then cd into elevator-system directory
Run commands:
```
npm install
```
```
ng serve
```
Open http://localhost:4200/ on your desktop


## Modele 
- model windy realistycznej, patrzącej tylko i wyłącznie na przyciski kliknięte na zewnątrz i w środku windy.
```
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
```
- model w którym do windy wsiadają ludzie i w momencie kliknięcia przycisku do jazdy w górę lub w dół losowane jest piętro docelowe. Winda tak jeździ aby zawieźć każdego na piętro docelowe.
```

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

```
## Algorytm
Winda jeździ góra dół, i nigdy nie zawraca. Czyli jeśli pierwszy przycisk na zewnątrz lub w środku został kliknięty winda zaczyna jechać w górę lub w dół. Winda zawsze odwiedza najwyższe piętro docelowe i jedzie w dół na najniższe piętro. Winda nie
bierze osób(w przypadku pierwszego modelu nie usuwa Requestu z piętra), jeśli jedzie w kierunku przeciwnym niż osoba chce jechać. Usuwa to problem zapychania windy przez osoby nie jadące w dobra stronę.




