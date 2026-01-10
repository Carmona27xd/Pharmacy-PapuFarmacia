import { TestBed } from '@angular/core/testing';

import { ServiceShowCustomDialog } from './service-dialog';

describe('ServiceShowCustomDialog', () => {
  let service: ServiceShowCustomDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceShowCustomDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
