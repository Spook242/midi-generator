import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternForm } from './pattern-form';

describe('PatternForm', () => {
  let component: PatternForm;
  let fixture: ComponentFixture<PatternForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
