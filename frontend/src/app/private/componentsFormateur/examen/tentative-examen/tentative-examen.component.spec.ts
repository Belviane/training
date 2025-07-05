import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TentativeExamenComponent } from './tentative-examen.component';

describe('TentativeExamenComponent', () => {
  let component: TentativeExamenComponent;
  let fixture: ComponentFixture<TentativeExamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TentativeExamenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TentativeExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
