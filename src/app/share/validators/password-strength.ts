import { AbstractControl, ValidationErrors } from '@angular/forms';

const lowercaseRegex = /[a-z]/;
const uppercaseRegex = /[A-Z]/;
const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
const numberRegex = /[0-9]/;

export const checkPasswordStrength = (
  value: string,
): 'week' | 'medium' | 'strong' | null => {
  if (!value) return null;

  if (
    value.length === 8 &&
    !uppercaseRegex.test(value) &&
    !specialCharsRegex.test(value)
  ) {
    return 'week';
  }

  const passwordPassedCheck = [
    lowercaseRegex.test(value),
    uppercaseRegex.test(value),
    specialCharsRegex.test(value),
    numberRegex.test(value),
  ].filter(Boolean).length;

  if (value.length >= 8 && value.length <= 11 && passwordPassedCheck === 2) {
    return 'medium';
  }

  if (value.length >= 12 && passwordPassedCheck >= 3) {
    return 'strong';
  }

  return null;
};

export const pwdStrengthValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;

  if (
    value.length === 8 &&
    !uppercaseRegex.test(value) &&
    !specialCharsRegex.test(value)
  ) {
    return null;
  }

  const passwordPassedCheck = [
    lowercaseRegex.test(value),
    uppercaseRegex.test(value),
    specialCharsRegex.test(value),
    numberRegex.test(value),
  ].filter(Boolean).length;

  if (value.length >= 8 && value.length <= 11 && passwordPassedCheck === 2) {
    return null;
  }

  if (value.length >= 12 && passwordPassedCheck >= 3) {
    return null;
  }

  return {
    pwdStrengthInvalid: true,
  };
};
