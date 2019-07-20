import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemColumnComponent } from './item-column.component';

describe('ItemColumnComponent', () => {
  let component: ItemColumnComponent;
  let fixture: ComponentFixture<ItemColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
