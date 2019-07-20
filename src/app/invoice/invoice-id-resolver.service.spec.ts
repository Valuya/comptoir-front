import { TestBed } from '@angular/core/testing';

import { InvoiceIdResolverService } from './invoice-id-resolver.service';

describe('InvoiceIdResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvoiceIdResolverService = TestBed.get(InvoiceIdResolverService);
    expect(service).toBeTruthy();
  });
});
