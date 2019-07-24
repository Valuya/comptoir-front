import { TestBed } from '@angular/core/testing';

import { ComptoirSaleService } from './comptoir-sale.service';

describe('ComptoirSaleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComptoirSaleService = TestBed.get(ComptoirSaleService);
    expect(service).toBeTruthy();
  });
});
