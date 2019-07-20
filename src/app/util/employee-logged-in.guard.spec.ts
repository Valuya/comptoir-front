import { TestBed, async, inject } from '@angular/core/testing';

import { EmployeeLoggedInGuard } from './employee-logged-in.guard';

describe('EmployeeLoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeLoggedInGuard]
    });
  });

  it('should ...', inject([EmployeeLoggedInGuard], (guard: EmployeeLoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
