import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { GuardAuth } from './auth-guard';

describe('GuardAuth', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => GuardAuth(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
