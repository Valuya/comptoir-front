import { TestBed } from '@angular/core/testing';

import { AccountTypeService } from './account-type.service';

describe('AccountTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountTypeService = TestBed.get(AccountTypeService);
    expect(service).toBeTruthy();
  });
});
