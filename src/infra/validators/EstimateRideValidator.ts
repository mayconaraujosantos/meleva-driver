import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { CustomerIdValidator } from './CustomerIdValidator';
import { DestinationValidator } from './DestinationValidator';
import { OriginValidator } from './OriginValidator';
import { type ValidationResult } from './ValidationResult';
import { type Validator } from './Validator';

export class EstimateRideValidator {
  private readonly firstValidator: Validator;
  constructor() {
    const originValidator = new OriginValidator();
    const destinationValidator = new DestinationValidator();
    const customerIdValidator = new CustomerIdValidator();

    originValidator.setNextValidator(destinationValidator);
    destinationValidator.setNextValidator(customerIdValidator);

    this.firstValidator = originValidator;
  }

  validate(input: EstimateRideInput): ValidationResult {
    return this.firstValidator.validate(input);
  }
}
