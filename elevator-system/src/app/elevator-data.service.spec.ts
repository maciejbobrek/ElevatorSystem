import { TestBed } from '@angular/core/testing';

import { ElevatorDataService } from './elevator-data.service';

describe('ElevatorDataService', () => {
  let service: ElevatorDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElevatorDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
