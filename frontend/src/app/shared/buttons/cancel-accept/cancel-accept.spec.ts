import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCancelAcceptButtons } from './cancel-accept';

describe('ComponentCancelAcceptButtons', () => {
  let component: ComponentCancelAcceptButtons;
  let fixture: ComponentFixture<ComponentCancelAcceptButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCancelAcceptButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentCancelAcceptButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
