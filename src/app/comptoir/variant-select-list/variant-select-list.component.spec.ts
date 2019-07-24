import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantSelectListComponent } from './variant-select-list.component';

describe('VariantSelectListComponent', () => {
  let component: VariantSelectListComponent;
  let fixture: ComponentFixture<VariantSelectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantSelectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
