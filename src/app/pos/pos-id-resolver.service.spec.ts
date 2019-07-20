import { TestBed } from '@angular/core/testing';

import { PosIdResolverService } from './pos-id-resolver.service';

describe('PosIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PosIdResolverService = TestBed.get(PosIdResolverService);
    expect(service).toBeTruthy();
  });
});
