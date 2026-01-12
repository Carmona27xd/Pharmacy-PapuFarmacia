import { TestBed } from '@angular/core/testing';

import { ServiceProduct } from './product';

describe('ServiceProduct', () => {
  let service: ServiceProduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
