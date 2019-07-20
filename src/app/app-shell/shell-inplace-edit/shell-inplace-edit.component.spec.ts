import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShellInplaceEditComponent} from './shell-inplace-edit.component';

describe('ShellInplaceEditComponent', () => {
  let component: ShellInplaceEditComponent;
  let fixture: ComponentFixture<ShellInplaceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShellInplaceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellInplaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
