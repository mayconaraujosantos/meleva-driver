import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { EstimateRideValidator } from '@/infra/validators/EstimateRideValidator';
import { OriginValidator } from '@/infra/validators/OriginValidator';
import { type ValidationResult } from '@/infra/validators/ValidationResult';
import { createEstimateRideInput } from '@/utils/createEstimateRideInput';
import { faker } from '@faker-js/faker';

describe('EstimateRideValidator', () => {
  let validator: EstimateRideValidator;

  beforeEach(() => {
    validator = new EstimateRideValidator();
  });

  it('should validate a valid input', () => {
    const validInput = createEstimateRideInput();
    const result: ValidationResult = validator.validate(validInput);
    expect(result).toEqual({ isValid: true, errorMessage: undefined });
  });

  it('should throw an error if origin is empty', () => {
    const inputWithEmptyOrigin: EstimateRideInput = createEstimateRideInput({ origin: '' });
    const result = validator.validate(inputWithEmptyOrigin);

    expect(result).toEqual({ isValid: false, errorMessage: 'The origin field cannot be empty.' });
  });

  it('should throw an error if destination is empty', () => {
    const inputWithEmptyDestination: EstimateRideInput = createEstimateRideInput({ destination: '' });
    const result = validator.validate(inputWithEmptyDestination);
    expect(result).toEqual({ isValid: false, errorMessage: 'The destination field cannot be empty.' });
  });

  it('should throw an error if origin and destination are the same', () => {
    const sameAddress = faker.location.streetAddress();
    const sameLocationInput: EstimateRideInput = createEstimateRideInput({
      origin: sameAddress,
      destination: sameAddress,
    });

    const result: ValidationResult = validator.validate(sameLocationInput);

    expect(result).toEqual({ isValid: false, errorMessage: 'Origin and destination cannot be the same.' });
  });

  it('should pass validation if destination is valid and no nextValidator exists', () => {
    const input: EstimateRideInput = { origin: 'Point A', destination: 'Point B', customerId: '123' };
    const result: ValidationResult = validator.validate(input);
    expect(result).toEqual({ isValid: true });
  });

  it('should throw an error if customerId is empty', () => {
    const inputWithEmptyCustomerId: EstimateRideInput = createEstimateRideInput({ customerId: '' });
    const result: ValidationResult = validator.validate(inputWithEmptyCustomerId);
    expect(result).toEqual({ isValid: false, errorMessage: 'The customer_id field cannot be empty.' });
  });
  it('should validate successfully if no nextValidator exists after customerIdValidator', () => {
    const input: EstimateRideInput = { origin: 'Point A', destination: 'Point B', customerId: '123' };
    const result: ValidationResult = validator.validate(input);
    expect(result).toEqual({ isValid: true });
  });
  it('should return isValid: true when no nextValidator is set', () => {
    const input: EstimateRideInput = createEstimateRideInput();
    const result: ValidationResult = validator.validate(input);

    expect(result).toEqual({ isValid: true });
  });
  it('should return isValid: true when no nextValidator is null', () => {
    const originValidator = new OriginValidator();
    originValidator.setNextValidator(null);
    const input: EstimateRideInput = { origin: 'Point A', destination: 'Point B', customerId: '123' };
    const result: ValidationResult = originValidator.validate(input);
    expect(result).toEqual({ isValid: true });
  });
});
