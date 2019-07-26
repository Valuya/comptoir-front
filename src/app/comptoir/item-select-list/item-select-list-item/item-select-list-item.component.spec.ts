import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectListItemComponent } from './item-select-list-item.component';

describe('ItemSelectListItemComponent', () => {
  let component: ItemSelectListItemComponent;
  let fixture: ComponentFixture<ItemSelectListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSelectListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
