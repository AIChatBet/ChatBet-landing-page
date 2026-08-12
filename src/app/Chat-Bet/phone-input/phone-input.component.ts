import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import intlTelInput, { Iti } from 'intl-tel-input/intlTelInputWithUtils';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent implements ControlValueAccessor, Validator, AfterViewInit, OnDestroy {
  @Input() placeholder = '';

  @ViewChild('phoneInput', { static: true })
  private phoneInputRef!: ElementRef<HTMLInputElement>;

  private iti!: Iti;
  private pendingValue: string | null = null;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.iti = intlTelInput(this.phoneInputRef.nativeElement, {
      initialCountry: 'co',
      separateDialCode: true,
      strictMode: true,
    });

    if (this.pendingValue) {
      this.iti.setNumber(this.pendingValue);
    }

    this.phoneInputRef.nativeElement.addEventListener('countrychange', () =>
      this.emitValue()
    );
  }

  ngOnDestroy(): void {
    this.iti?.destroy();
  }

  writeValue(value: string): void {
    if (!this.iti) {
      this.pendingValue = value;
      return;
    }
    this.iti.setNumber(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.phoneInputRef.nativeElement.disabled = isDisabled;
    this.iti?.setDisabled(isDisabled);
  }

  onInput(): void {
    this.emitValue();
  }

  onBlur(): void {
    this.onTouched();
  }

  validate(): ValidationErrors | null {
    if (!this.iti || !this.phoneInputRef.nativeElement.value) {
      return null;
    }
    return this.iti.isValidNumber() ? null : { invalidPhoneNumber: true };
  }

  private emitValue(): void {
    this.onChange(this.iti.getNumber('E164'));
  }
}
