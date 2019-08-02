import {TestBed} from '@angular/core/testing';

import {StockVariantIdResolverService} from './stock-variant-id-resolver.service';

describe('StockVariantIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockVariantIdResolverService = TestBed.get(StockVariantIdResolverService);
    expect(service).toBeTruthy();
  });
});
