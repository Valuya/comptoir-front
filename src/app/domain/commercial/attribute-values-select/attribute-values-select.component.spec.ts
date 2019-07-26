import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeValuesSelectComponent } from './attribute-values-select.component';

describe('AttributeValuesSelectComponent', () => {
  let component: AttributeValuesSelectComponent;
  let fixture: ComponentFixture<AttributeValuesSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeValuesSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeValuesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
