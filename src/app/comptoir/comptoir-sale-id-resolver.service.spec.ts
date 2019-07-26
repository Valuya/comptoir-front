import { TestBed } from '@angular/core/testing';

import { ComptoirSaleIdResolverService } from './comptoir-sale-id-resolver.service';

describe('ComptoirSaleIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComptoirSaleIdResolverService = TestBed.get(ComptoirSaleIdResolverService);
    expect(service).toBeTruthy();
  });
});
