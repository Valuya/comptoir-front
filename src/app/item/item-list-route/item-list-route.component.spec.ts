import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemListRouteComponent} from './item-list-route.component';

describe('ItemListRouteComponent', () => {
  let component: ItemListRouteComponent;
  let fixture: ComponentFixture<ItemListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
