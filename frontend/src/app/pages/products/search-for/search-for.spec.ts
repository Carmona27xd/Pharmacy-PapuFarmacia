import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSearchForProducts } from './search-for';

describe('PageSearchForProducts', () => {
  let component: PageSearchForProducts;
  let fixture: ComponentFixture<PageSearchForProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSearchForProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(PageSearchForProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
