import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LocaleTextComponent} from './locale-text.component';

describe('LocaleTextComponent', () => {
  let component: LocaleTextComponent;
  let fixture: ComponentFixture<LocaleTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocaleTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocaleTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
