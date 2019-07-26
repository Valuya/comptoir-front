import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemDetailVariantsRouteComponent} from './item-detail-variants-route.component';

describe('ItemDetailVariantsRouteComponent', () => {
  let component: ItemDetailVariantsRouteComponent;
  let fixture: ComponentFixture<ItemDetailVariantsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailVariantsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailVariantsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
