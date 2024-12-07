import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { OriginValidator } from '@/infra/validators/OriginValidator';
import { type ValidationResult } from '@/infra/validators/ValidationResult';
import { type Validator } from '@/infra/validators/Validator';
import { createEstimateRideInput } from '@/utils/createEstimateRideInput';

describe('OriginValidator (Isolated Tests)', () => {
  let originValidator: OriginValidator;
  let mockNextValidator: jest.Mocked<Validator>;

  beforeEach(() => {
    // Instancia do OriginValidator
    originValidator = new OriginValidator();
    // Mock do proximo validator (isolado)
    mockNextValidator = {
      validate: jest.fn(),
      setNextValidator: jest.fn(),
    } as unknown as jest.Mocked<Validator>;
    // Configurando o próximo validador mockado no OriginValidator
    originValidator.setNextValidator(mockNextValidator);
  });

  it('should not call the next validator when origin is empty', () => {
    const inputWithEmptyOrigin: EstimateRideInput = createEstimateRideInput({ origin: '' });
    originValidator.validate(inputWithEmptyOrigin);
    expect(mockNextValidator.validate).not.toHaveBeenCalled();
  });

  it('should call the next validator when origin is valid', () => {
    const inputWithValidOrigin: EstimateRideInput = createEstimateRideInput();

    mockNextValidator.validate.mockReturnValue({ isValid: true });

    originValidator.validate(inputWithValidOrigin);

    expect(mockNextValidator.validate).toHaveBeenCalledWith(inputWithValidOrigin);
  });

  it('should return invalid when origin is empty', () => {
    const inputWithEmptyOrigin: EstimateRideInput = createEstimateRideInput({ origin: '' });
    const result = originValidator.validate(inputWithEmptyOrigin);
    expect(result).toEqual({ isValid: false, errorMessage: 'The origin field cannot be empty.' });
  });
  it('should return valid when origin is not empty and call next validator', () => {
    const inputWithValidOrigin: EstimateRideInput = createEstimateRideInput();
    mockNextValidator.validate.mockReturnValue({ isValid: true });

    const result = originValidator.validate(inputWithValidOrigin);
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid when no next validator is set', () => {
    originValidator.setNextValidator(null);

    const inputWithValidOrigin: EstimateRideInput = createEstimateRideInput();
    const result: ValidationResult = originValidator.validate(inputWithValidOrigin);
    expect(result).toEqual({ isValid: true });
  });
});
