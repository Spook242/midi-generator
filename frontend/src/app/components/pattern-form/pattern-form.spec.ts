import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternFormComponent } from './pattern-form';

describe('PatternForm', () => {
  let component: PatternFormComponent;
  let fixture: ComponentFixture<PatternFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
