import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviapprenantComponent } from './suiviapprenant.component';

describe('SuiviapprenantComponent', () => {
  let component: SuiviapprenantComponent;
  let fixture: ComponentFixture<SuiviapprenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviapprenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviapprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
