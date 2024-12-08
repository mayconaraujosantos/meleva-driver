import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { type ValidationResult } from './ValidationResult';

export abstract class Validator {
  protected nextValidator: Validator | null = null;
  abstract validate(input: EstimateRideInput): ValidationResult;

  setNextValidator(validator: Validator | null): void {
    this.nextValidator = validator;
  }
}
