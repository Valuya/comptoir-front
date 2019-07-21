import { TestBed } from '@angular/core/testing';

import { AttributesService } from './attributes.service';

describe('AttributeValueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttributesService = TestBed.get(AttributesService);
    expect(service).toBeTruthy();
  });
});
