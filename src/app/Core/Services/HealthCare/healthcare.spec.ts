import { TestBed } from '@angular/core/testing';

import { Healthcare } from '../HealthCare/healthcare';

describe('Healthcare', () => {
  let service: Healthcare;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Healthcare);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
