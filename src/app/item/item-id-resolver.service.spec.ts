import { TestBed } from '@angular/core/testing';

import { ItemIdResolverService } from './item-id-resolver.service';

describe('ItemIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemIdResolverService = TestBed.get(ItemIdResolverService);
    expect(service).toBeTruthy();
  });
});
