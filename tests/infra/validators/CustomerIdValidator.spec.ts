import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { CustomerIdValidator } from '@/infra/validators/CustomerIdValidator';
import { type ValidationResult } from '@/infra/validators/ValidationResult';
import { type Validator } from '@/infra/validators/Validator';
import { createEstimateRideInput } from '@/utils/createEstimateRideInput';

describe('CustomerIdValidator', () => {
  let validator: CustomerIdValidator;

  beforeEach(() => {
    validator = new CustomerIdValidator();
  });

  it('should return an error if customerId is empty', () => {
    const inputWithEmptyCustomerId: EstimateRideInput = createEstimateRideInput({ customerId: '' });
    const result: ValidationResult = validator.validate(inputWithEmptyCustomerId);
    expect(result).toEqual({ isValid: false, errorMessage: 'The customer_id field cannot be empty.' });
  });

  it('should pass validation if customerId is provided', () => {
    const inputWithCustomerId: EstimateRideInput = createEstimateRideInput({ customerId: '123' });
    const result: ValidationResult = validator.validate(inputWithCustomerId);
    expect(result).toEqual({ isValid: true });
  });
  it('should return a validation error if customerId is empty', () => {
    const input: EstimateRideInput = createEstimateRideInput({ customerId: '' });
    const result: ValidationResult = validator.validate(input);
    expect(result).toEqual({
      isValid: false,
      errorMessage: 'The customer_id field cannot be empty.',
    });
  });

  it('should call nextValidator.validate when nextValidator is set', () => {
    // Mock nextValidator
    const mockNextValidator = {
      validate: jest.fn().mockReturnValue({ isValid: true }),
    };
    validator.setNextValidator(mockNextValidator as unknown as Validator);

    const input: EstimateRideInput = createEstimateRideInput();
    const result: ValidationResult = validator.validate(input);

    expect(mockNextValidator.validate).toHaveBeenCalledWith(input);
    expect(result).toEqual({ isValid: true });
  });

  it('should return isValid: true when no nextValidator is set', () => {
    const input: EstimateRideInput = createEstimateRideInput();
    const result: ValidationResult = validator.validate(input);

    expect(result).toEqual({ isValid: true });
  });
});
