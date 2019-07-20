import { TestBed } from '@angular/core/testing';

import { LocaleTextsEditService } from './locale-texts-edit.service';

describe('LocaleTextsEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocaleTextsEditService = TestBed.get(LocaleTextsEditService);
    expect(service).toBeTruthy();
  });
});
