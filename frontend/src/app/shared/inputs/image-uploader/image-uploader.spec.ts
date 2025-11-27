import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentImageUploader } from './image-uploader';

describe('ComponentImageUploader', () => {
  let component: ComponentImageUploader;
  let fixture: ComponentFixture<ComponentImageUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentImageUploader],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentImageUploader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
