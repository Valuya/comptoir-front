import {TestBed} from '@angular/core/testing';

import {InplaceEditService} from './inplace-edit.service';

describe('InplaceEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InplaceEditService = TestBed.get(InplaceEditService);
    expect(service).toBeTruthy();
  });
});
