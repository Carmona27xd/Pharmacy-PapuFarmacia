import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSearchBox } from './search-box';

describe('ComponentSearchBox', () => {
  let component: ComponentSearchBox;
  let fixture: ComponentFixture<ComponentSearchBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentSearchBox],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentSearchBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
