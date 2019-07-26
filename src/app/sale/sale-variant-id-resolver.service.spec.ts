import {TestBed} from '@angular/core/testing';

import {SaleVariantIdResolverService} from './sale-variant-id-resolver.service';

describe('SaleVariantIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaleVariantIdResolverService = TestBed.get(SaleVariantIdResolverService);
    expect(service).toBeTruthy();
  });
});
