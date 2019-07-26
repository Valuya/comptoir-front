import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectListComponent } from './item-select-list.component';

describe('ItemSelectListComponent', () => {
  let component: ItemSelectListComponent;
  let fixture: ComponentFixture<ItemSelectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSelectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
