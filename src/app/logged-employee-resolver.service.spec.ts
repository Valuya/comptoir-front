import { TestBed } from '@angular/core/testing';

import { LoggedEmployeeResolverService } from './logged-employee-resolver.service';

describe('LoggedEmployeeResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoggedEmployeeResolverService = TestBed.get(LoggedEmployeeResolverService);
    expect(service).toBeTruthy();
  });
});
