import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleformationComponent } from './nouvelleformation.component';

describe('NouvelleformationComponent', () => {
  let component: NouvelleformationComponent;
  let fixture: ComponentFixture<NouvelleformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouvelleformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
