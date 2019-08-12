import { TestBed } from '@angular/core/testing';

import { SaleSearchFilterResolverService } from './sale-search-filter-resolver.service';

describe('SaleSearchFilterResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaleSearchFilterResolverService = TestBed.get(SaleSearchFilterResolverService);
    expect(service).toBeTruthy();
  });
});
