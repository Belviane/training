import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenStatsComponent } from './examen-stats.component';

describe('ExamenStatsComponent', () => {
  let component: ExamenStatsComponent;
  let fixture: ComponentFixture<ExamenStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamenStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
