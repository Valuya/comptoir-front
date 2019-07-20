import { TestBed } from '@angular/core/testing';

import { EmployeeIdResolverService } from './employee-id-resolver.service';

describe('EmployeeIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmployeeIdResolverService = TestBed.get(EmployeeIdResolverService);
    expect(service).toBeTruthy();
  });
});
