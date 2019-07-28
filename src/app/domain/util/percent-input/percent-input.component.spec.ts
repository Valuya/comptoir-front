import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentInputComponent } from './percent-input.component';

describe('PercentInputComponent', () => {
  let component: PercentInputComponent;
  let fixture: ComponentFixture<PercentInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
