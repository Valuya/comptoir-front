import { TestBed } from '@angular/core/testing';

import { ItemVariantIdResolverService } from './item-variant-id-resolver.service';

describe('ItemVariantIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemVariantIdResolverService = TestBed.get(ItemVariantIdResolverService);
    expect(service).toBeTruthy();
  });
});
