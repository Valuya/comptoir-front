import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemDetailFormRouteComponent} from './item-detail-form-route.component';

describe('ItemDetailFormRouteComponent', () => {
  let component: ItemDetailFormRouteComponent;
  let fixture: ComponentFixture<ItemDetailFormRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailFormRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailFormRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
