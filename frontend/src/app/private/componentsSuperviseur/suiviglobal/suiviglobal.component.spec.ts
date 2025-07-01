import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviglobalComponent } from './suiviglobal.component';

describe('SuiviglobalComponent', () => {
  let component: SuiviglobalComponent;
  let fixture: ComponentFixture<SuiviglobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviglobalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviglobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
