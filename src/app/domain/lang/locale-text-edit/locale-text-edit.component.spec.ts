import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocaleTextEditComponent} from './locale-text-edit.component';

describe('LocaleTextEditComponent', () => {
  let component: LocaleTextEditComponent;
  let fixture: ComponentFixture<LocaleTextEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocaleTextEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocaleTextEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
