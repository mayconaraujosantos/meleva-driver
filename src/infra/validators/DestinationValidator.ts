import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { type ValidationResult } from './ValidationResult';
import { Validator } from './Validator';

export class DestinationValidator extends Validator {
  validate(input: EstimateRideInput): ValidationResult {
    if (input.destination === '') {
      return { isValid: false, errorMessage: 'The destination field cannot be empty.' };
    }
    if (input.destination === input.origin) {
      return { isValid: false, errorMessage: 'Origin and destination cannot be the same.' };
    }
    return this.nextValidator?.validate(input) ?? { isValid: true };
  }
}
