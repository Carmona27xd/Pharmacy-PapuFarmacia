import { TestBed } from '@angular/core/testing';

import { ServiceDialog } from './service-dialog';

describe('ServiceDialog', () => {
  let service: ServiceDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
