import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyProfile } from './view-my-profile';

describe('ViewMyProfile', () => {
  let component: ViewMyProfile;
  let fixture: ComponentFixture<ViewMyProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMyProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMyProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
