import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Healthcarecategory } from './healthcarecategory';

describe('Healthcarecategory', () => {
  let component: Healthcarecategory;
  let fixture: ComponentFixture<Healthcarecategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Healthcarecategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Healthcarecategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
