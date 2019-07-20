import { TestBed } from '@angular/core/testing';

import { SaleIdResolverService } from './sale-id-resolver.service';

describe('SaleIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaleIdResolverService = TestBed.get(SaleIdResolverService);
    expect(service).toBeTruthy();
  });
});
