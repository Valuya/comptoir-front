import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShellTableComponent} from './shell-table.component';

describe('ShellTableComponent', () => {
  let component: ShellTableComponent;
  let fixture: ComponentFixture<ShellTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShellTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
