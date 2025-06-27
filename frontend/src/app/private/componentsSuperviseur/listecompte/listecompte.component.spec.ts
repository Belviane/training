import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListecompteComponent } from './listecompte.component';

describe('ListecompteComponent', () => {
  let component: ListecompteComponent;
  let fixture: ComponentFixture<ListecompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListecompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListecompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
