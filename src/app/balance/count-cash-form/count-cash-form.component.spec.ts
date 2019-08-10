import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountCashFormComponent } from './count-cash-form.component';

describe('CountCashFormComponent', () => {
  let component: CountCashFormComponent;
  let fixture: ComponentFixture<CountCashFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountCashFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountCashFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
