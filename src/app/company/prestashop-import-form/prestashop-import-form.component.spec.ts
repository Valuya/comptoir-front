import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestashopImportFormComponent } from './prestashop-import-form.component';

describe('PrestashopImportFormComponent', () => {
  let component: PrestashopImportFormComponent;
  let fixture: ComponentFixture<PrestashopImportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestashopImportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestashopImportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
