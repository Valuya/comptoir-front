import { TestBed } from '@angular/core/testing';

import { AccountingEntrySearchFilterResolverService } from './accounting-entry-search-filter-resolver.service';

describe('AccountingEntrySearchFilterResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountingEntrySearchFilterResolverService = TestBed.get(AccountingEntrySearchFilterResolverService);
    expect(service).toBeTruthy();
  });
});
