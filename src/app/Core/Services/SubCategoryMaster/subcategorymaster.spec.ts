import { TestBed } from '@angular/core/testing';

import { Subcategorymaster } from './subcategorymaster';

describe('Subcategorymaster', () => {
  let service: Subcategorymaster;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Subcategorymaster);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
