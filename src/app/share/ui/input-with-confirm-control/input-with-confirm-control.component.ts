import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputWithConfirmControlComponent),
  multi: true,
};

const CONTROL_VALUE_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => InputWithConfirmControlComponent),
  multi: true,
};

@Component({
  selector: 'app-input-with-confirm-control',
  templateUrl: './input-with-confirm-control.component.html',
  styleUrls: ['./input-with-confirm-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
  ],
  providers: [CONTROL_VALUE_ACCESSOR, CONTROL_VALUE_VALIDATORS],
})
export class InputWithConfirmControlComponent
  implements ControlValueAccessor, Validator, OnInit
{
  @Input() valueLabel: string | null = null;
  @Input() confirmLabel: string | null = null;
  @Input() type: 'text' | 'password' = 'text';
  @Input() placeholder: string | undefined = undefined;

  showValue = false;
  showConfirmValue = false;
  valueControl = new FormControl<string | null>(null);
  confirmControl = new FormControl<string | null>(null);

  onChange: ((value: string | null) => undefined) | undefined;
  onTouched: (() => undefined) | undefined;
  onValidationChange: (() => undefined) | undefined;

  constructor() {
    this.valueControl.valueChanges.subscribe(() => {
      if (this.onChange) this.onChange(this.valueControl.value);
      if (this.onValidationChange) this.onValidationChange();
      if (this.onTouched) this.onTouched();
    });

    this.confirmControl.valueChanges.subscribe(() => {
      if (this.onChange) this.onChange(this.valueControl.value);
      if (this.onValidationChange) this.onValidationChange();
      if (this.onTouched) this.onTouched();
    });
  }

  ngOnInit(): void {
    this.showValue = this.type === 'text';
    this.showConfirmValue = this.type === 'text';
  }

  registerOnValidatorChange?(fn: () => undefined): void {
    this.onValidationChange = fn;
  }

  writeValue(value: string | null): void {
    this.valueControl.setValue(value, { emitEvent: false });
    this.confirmControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.valueControl.value != this.confirmControl.value) {
      return { misMatch: true };
    }
    return null;
  }
}
