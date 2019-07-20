import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShellDetailsFormComponent} from './shell-details-form.component';

describe('ShellDetailsFormComponent', () => {
  let component: ShellDetailsFormComponent;
  let fixture: ComponentFixture<ShellDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShellDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
