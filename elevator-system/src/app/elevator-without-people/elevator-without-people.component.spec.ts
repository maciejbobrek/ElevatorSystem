import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevatorWithoutPeopleComponent } from './elevator-without-people.component';

describe('ElevatorWithoutPeopleComponent', () => {
  let component: ElevatorWithoutPeopleComponent;
  let fixture: ComponentFixture<ElevatorWithoutPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElevatorWithoutPeopleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElevatorWithoutPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
