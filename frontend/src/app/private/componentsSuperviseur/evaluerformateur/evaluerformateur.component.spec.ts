import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluerformateurComponent } from './evaluerformateur.component';

describe('EvaluerformateurComponent', () => {
  let component: EvaluerformateurComponent;
  let fixture: ComponentFixture<EvaluerformateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluerformateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluerformateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
