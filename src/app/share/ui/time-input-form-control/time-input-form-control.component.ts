import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface TimeValue {
  hour: number | null;
  minute: number | null;
}

@Component({
  selector: 'app-time-input-form-control',
  templateUrl: './time-input-form-control.component.html',
  styleUrls: ['./time-input-form-control.component.scss'],
  imports: [MatFormFieldModule, MatInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputFormControlComponent),
      multi: true,
    },
  ],
})
export class TimeInputFormControlComponent implements OnInit, ControlValueAccessor {
  @Input() minHour = 0;
  @Input() maxHour = 23;
  @Input() minMinute = 0;
  @Input() maxMinute = 59;
  @Input() required: boolean = false;

  private onTouched: () => void = () => {};
  private onChanged: (value: TimeValue | null) => void = () => {};

  formGroup = new FormGroup({
    hour: new FormControl<number | null>(null, [Validators.min(this.minHour), Validators.max(this.maxHour)]),
    minute: new FormControl<number | null>(null, [Validators.min(this.minMinute), Validators.max(this.minMinute)]),
  });

  constructor() {
    this.formGroup.valueChanges.pipe(takeUntilDestroyed()).subscribe((value: any) => {
      if (this.formGroup.invalid) {
        this.onChanged(null);
      } else {
        this.onChanged(value);
      }
    });
  }

  ngOnInit() {
    if (this.required) {
      this.formGroup.get('hour')?.setValidators(Validators.required);
      this.formGroup.get('minute')?.setValidators(Validators.required);
    } else {
      this.formGroup.get('hour')?.clearValidators();
      this.formGroup.get('minute')?.clearValidators();
    }

    this.formGroup.updateValueAndValidity();
  }

  writeValue(obj: TimeValue | null): void {
    if (obj) {
      this.formGroup.setValue({ hour: obj.hour, minute: obj.minute }, { emitEvent: false });
    } else {
      this.formGroup.reset({ hour: null, minute: null }, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  markAsTouched() {
    this.onTouched();
  }
}
