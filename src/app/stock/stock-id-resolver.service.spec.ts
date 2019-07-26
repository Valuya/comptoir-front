import {TestBed} from '@angular/core/testing';

import {StockIdResolverService} from './stock-id-resolver.service';

describe('StockIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockIdResolverService = TestBed.get(StockIdResolverService);
    expect(service).toBeTruthy();
  });
});
