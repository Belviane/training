import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckclassedialogComponent } from './checkclassedialog.component';

describe('CheckclassedialogComponent', () => {
  let component: CheckclassedialogComponent;
  let fixture: ComponentFixture<CheckclassedialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckclassedialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckclassedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
