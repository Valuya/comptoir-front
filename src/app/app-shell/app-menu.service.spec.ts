import { TestBed } from '@angular/core/testing';

import { AppMenuService } from './app-menu.service';

describe('AppMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppMenuService = TestBed.get(AppMenuService);
    expect(service).toBeTruthy();
  });
});
