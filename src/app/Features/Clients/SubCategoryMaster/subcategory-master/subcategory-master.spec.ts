import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryMaster } from './subcategory-master';

describe('SubcategoryMaster', () => {
  let component: SubcategoryMaster;
  let fixture: ComponentFixture<SubcategoryMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcategoryMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
