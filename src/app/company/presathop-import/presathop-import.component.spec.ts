import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresathopImportComponent } from './presathop-import.component';

describe('PresathopImportComponent', () => {
  let component: PresathopImportComponent;
  let fixture: ComponentFixture<PresathopImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresathopImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresathopImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
