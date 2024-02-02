import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevatorStatusComponent } from './elevator-status.component';

describe('ElevatorStatusComponent', () => {
  let component: ElevatorStatusComponent;
  let fixture: ComponentFixture<ElevatorStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElevatorStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElevatorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
