import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeDefinitionSelectComponent } from './attribute-definition-select.component';

describe('AttributeDefinitionSelectComponent', () => {
  let component: AttributeDefinitionSelectComponent;
  let fixture: ComponentFixture<AttributeDefinitionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeDefinitionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeDefinitionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
