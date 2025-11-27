import { Component, Input, forwardRef, ChangeDetectorRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComponentInputField),
      multi: true,
    },
  ],
  templateUrl: './input-field.html',
})
export class ComponentInputField {
  @Input() label: string = '';
  @Input() type: string = 'text'; // text, password, email, number, etc.
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() autoComplete: string = 'off';

  // Estado interno
  value: string | null = '';

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  // Reactive Forms -> Angular llama a esto cuando carga el control
  writeValue(obj: any): void {
    // Normaliza: nunca undefined/NULL -> evita que el input tenga value="undefined"
    this.value = obj ?? '';
    // Forzamos detección por si writeValue se llamó fuera del ciclo
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    // actualizar vista por si hace falta
    this.cdr.markForCheck();
  }

  // Handler del input nativo
  onInput(value: string) {
    this.value = value;
    this.onChange(value);
  }

  onBlur() {
    this.onTouched();
  }
}
