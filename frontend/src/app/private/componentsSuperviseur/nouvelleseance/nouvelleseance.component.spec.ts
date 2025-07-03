import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleseanceComponent } from './nouvelleseance.component';

describe('NouvelleseanceComponent', () => {
  let component: NouvelleseanceComponent;
  let fixture: ComponentFixture<NouvelleseanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouvelleseanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleseanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
