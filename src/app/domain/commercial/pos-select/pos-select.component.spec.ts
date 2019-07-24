import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSelectComponent } from './pos-select.component';

describe('PosSelectComponent', () => {
  let component: PosSelectComponent;
  let fixture: ComponentFixture<PosSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
