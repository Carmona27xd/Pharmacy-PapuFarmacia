import { TestBed } from '@angular/core/testing';

import { ServiceAdmmin } from './admin';

describe('ServiceAdmmin', () => {
  let service: ServiceAdmmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAdmmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});