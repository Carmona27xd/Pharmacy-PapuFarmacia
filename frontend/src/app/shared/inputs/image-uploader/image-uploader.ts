import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComponentImageUploader),
      multi: true,
    },
  ],
  templateUrl: './image-uploader.html',
})
export class ComponentImageUploader implements ControlValueAccessor {
  @Input() label: string = '';

  value: string | null = null;
  disabled = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Convertimos la imagen a Base64
    const reader = new FileReader();
    reader.onload = () => {
      this.value = reader.result as string;
      this.onChange(this.value);
      this.onTouched();
    };
    reader.readAsDataURL(file);
  }
}
