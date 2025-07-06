import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignformateursdialogComponent } from './assignformateursdialog.component';

describe('AssignformateursdialogComponent', () => {
  let component: AssignformateursdialogComponent;
  let fixture: ComponentFixture<AssignformateursdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignformateursdialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignformateursdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
