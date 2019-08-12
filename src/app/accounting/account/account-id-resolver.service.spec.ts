import {TestBed} from '@angular/core/testing';

import {AccountIdResolverService} from './account-id-resolver.service';

describe('AccountIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountIdResolverService = TestBed.get(AccountIdResolverService);
    expect(service).toBeTruthy();
  });
});
