import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectGridItemComponent } from './item-select-grid-item.component';

describe('ItemSelectGridItemComponent', () => {
  let component: ItemSelectGridItemComponent;
  let fixture: ComponentFixture<ItemSelectGridItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSelectGridItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
