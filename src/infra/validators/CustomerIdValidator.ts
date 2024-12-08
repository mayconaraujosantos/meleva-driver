import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { type ValidationResult } from './ValidationResult';
import { Validator } from './Validator';

export class CustomerIdValidator extends Validator {
  validate(input: EstimateRideInput): ValidationResult {
    if (input.customerId === '') {
      return { isValid: false, errorMessage: 'The customer_id field cannot be empty.' };
    }
    return this.nextValidator?.validate(input) ?? { isValid: true };
  }
}
