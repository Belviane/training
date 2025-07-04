import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviparentComponent } from './suiviparent.component';

describe('SuiviparentComponent', () => {
  let component: SuiviparentComponent;
  let fixture: ComponentFixture<SuiviparentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviparentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
