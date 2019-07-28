import { TestBed } from '@angular/core/testing';

import { WebNotificationService } from './web-notification.service';

describe('WebNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebNotificationService = TestBed.get(WebNotificationService);
    expect(service).toBeTruthy();
  });
});
