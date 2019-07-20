import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailsRouteComponent } from './item-details-route.component';

describe('ItemDetailsRouteComponent', () => {
  let component: ItemDetailsRouteComponent;
  let fixture: ComponentFixture<ItemDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
