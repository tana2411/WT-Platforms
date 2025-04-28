import { AbstractControl, ValidationErrors } from '@angular/forms';

export const PasswordStrength = (
  control: AbstractControl,
): ValidationErrors | null => {
  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const numberRegex = /[0-9]/;

  const value = control.value;
  if (!value) return null;

  if (
    value.length === 8 &&
    !uppercaseRegex.test(value) &&
    !specialCharsRegex.test(value)
  ) {
    return { weak: true };
  }

  const passwordPassedCheck = [
    lowercaseRegex.test(value),
    uppercaseRegex.test(value),
    specialCharsRegex.test(value),
    numberRegex.test(value),
  ].filter(Boolean).length;

  if (value.length >= 8 && value.length <= 11 && passwordPassedCheck === 2) {
    return { medium: true };
  }

  if (value.length >= 12 && passwordPassedCheck >= 3) {
    return { strong: true };
  }

  return null;
};
