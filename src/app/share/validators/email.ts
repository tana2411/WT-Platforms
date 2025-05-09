import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { EMAIL_PATTERN } from 'app/routes/login/login.component';

export class EmailValidators {
  static pattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const valid = EMAIL_PATTERN.test(control.value);
      return valid
        ? null
        : {
            email: {
              message: 'Please enter a valid email address.',
            },
          };
    };
  }
}
