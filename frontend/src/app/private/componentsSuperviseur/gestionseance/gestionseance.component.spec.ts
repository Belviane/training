import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionseanceComponent } from './gestionseance.component';

describe('GestionseanceComponent', () => {
  let component: GestionseanceComponent;
  let fixture: ComponentFixture<GestionseanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionseanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionseanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
