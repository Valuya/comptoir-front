import {TestBed} from '@angular/core/testing';

import {CustomerIdResolverService} from './customer-id-resolver.service';

describe('CustomerIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerIdResolverService = TestBed.get(CustomerIdResolverService);
    expect(service).toBeTruthy();
  });
});
