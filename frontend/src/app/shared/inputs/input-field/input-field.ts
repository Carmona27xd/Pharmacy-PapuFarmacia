import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, ChangeDetectorRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validators } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule],
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
  // Configuración general
  @Input() label: string = '';
  @Input() fieldType: 'input' | 'textarea' | 'select' = 'input';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() autoComplete: string = 'off';

  // Para input
  @Input() type: string = 'text'; // text, password, email, number, date, etc.

  // Para textarea
  @Input() rows: number = 4;
  @Input() maxLength?: number;

  // Para select
  @Input() options: SelectOption[] = [];
  @Input() emptyOptionText: string = 'Seleccione una opción';
  @Input() showEmptyOption: boolean = true;

  // Estado interno
  value: any = '';

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  // ControlValueAccessor Implementation
  writeValue(obj: any): void {
    this.value = obj ?? '';
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
    this.cdr.markForCheck();
  }

  // Event Handlers
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
