import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { DestinationValidator } from '@/infra/validators/DestinationValidator';
import { type ValidationResult } from '@/infra/validators/ValidationResult';
import { type Validator } from '@/infra/validators/Validator';

describe('DestinationValidator', () => {
  let validator: DestinationValidator;

  beforeEach(() => {
    validator = new DestinationValidator();
  });

  it('should return an error if destination is empty', () => {
    const input: EstimateRideInput = { origin: 'Point A', destination: '', customerId: '123' };
    const result: ValidationResult = validator.validate(input);

    expect(result).toEqual({
      isValid: false,
      errorMessage: 'The destination field cannot be empty.',
    });
  });

  it('should return an error if destination and origin are the same', () => {
    const input: EstimateRideInput = { origin: 'Point A', destination: 'Point A', customerId: '123' };
    const result: ValidationResult = validator.validate(input);

    expect(result).toEqual({
      isValid: false,
      errorMessage: 'Origin and destination cannot be the same.',
    });
  });

  it('should call nextValidator.validate when nextValidator is set', () => {
    // Mock nextValidator
    const mockNextValidator = {
      validate: jest.fn().mockReturnValue({ isValid: true }),
    };
    validator.setNextValidator(mockNextValidator as unknown as Validator);

    const input: EstimateRideInput = { origin: 'Point A', destination: 'Point B', customerId: '123' };
    const result: ValidationResult = validator.validate(input);

    expect(mockNextValidator.validate).toHaveBeenCalledWith(input);
    expect(result).toEqual({ isValid: true });
  });

  it('should return isValid: true when no nextValidator is set', () => {
    const input: EstimateRideInput = { origin: 'Point A', destination: 'Point B', customerId: '123' };
    const result: ValidationResult = validator.validate(input);

    expect(result).toEqual({ isValid: true });
  });
});
