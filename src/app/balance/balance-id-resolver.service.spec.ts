import {TestBed} from '@angular/core/testing';

import {BalanceIdResolverService} from './balance-id-resolver.service';

describe('BalanceIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BalanceIdResolverService = TestBed.get(BalanceIdResolverService);
    expect(service).toBeTruthy();
  });
});
