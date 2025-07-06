import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleclasseComponent } from './nouvelleclasse.component';

describe('NouvelleclasseComponent', () => {
  let component: NouvelleclasseComponent;
  let fixture: ComponentFixture<NouvelleclasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouvelleclasseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleclasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
