import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpensnesComponent } from './view-expensnes.component';

describe('ViewExpensnesComponent', () => {
  let component: ViewExpensnesComponent;
  let fixture: ComponentFixture<ViewExpensnesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExpensnesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExpensnesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
