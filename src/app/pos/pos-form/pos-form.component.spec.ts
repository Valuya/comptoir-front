import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PosFormComponent} from './pos-form.component';

describe('PosFormComponent', () => {
  let component: PosFormComponent;
  let fixture: ComponentFixture<PosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
