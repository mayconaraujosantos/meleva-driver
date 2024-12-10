import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { type ValidationResult } from './ValidationResult';
import { Validator } from './Validator';

export class OriginValidator extends Validator {
  validate(input: EstimateRideInput): ValidationResult {
    if (input.origin === '') {
      return { isValid: false, errorMessage: 'The origin field cannot be empty.' };
    }
    return this.nextValidator?.validate(input) ?? { isValid: true };
  }
}
