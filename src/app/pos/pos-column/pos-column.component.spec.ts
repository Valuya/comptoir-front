import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosColumnComponent } from './pos-column.component';

describe('PosColumnComponent', () => {
  let component: PosColumnComponent;
  let fixture: ComponentFixture<PosColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
