import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShellContentPageComponent} from './shell-content-page.component';

describe('ShellContentPageComponent', () => {
  let component: ShellContentPageComponent;
  let fixture: ComponentFixture<ShellContentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShellContentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellContentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
