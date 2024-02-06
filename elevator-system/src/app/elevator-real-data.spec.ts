import { TestBed } from '@angular/core/testing';

import { ElevatorRealDataService } from './elevator-real-data.service';

describe('ElevatorWithoutPeopleServiceService', () => {
  let service: ElevatorRealDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElevatorRealDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
