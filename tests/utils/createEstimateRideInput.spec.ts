import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { createEstimateRideInput } from '@/utils/createEstimateRideInput';

describe('createEstimateRideInput', () => {
  it('deve criar um novo input de estimativa de corrida com valores padrão', () => {
    const input = createEstimateRideInput();

    expect(input).toHaveProperty('customerId');
    expect(input).toHaveProperty('origin');
    expect(input).toHaveProperty('destination');
    expect(typeof input.customerId).toBe('string');
    expect(typeof input.origin).toBe('string');
    expect(typeof input.destination).toBe('string');
  });

  it('deve criar um novo input de estimativa de corrida com valores personalizados', () => {
    const options: Partial<EstimateRideInput> = {
      customerId: '123',
      origin: 'Rua A',
      destination: 'Rua B',
    };
    const input = createEstimateRideInput(options);
    expect(input).toEqual(options);
  });
  it('deve criar um novo input de estimativa de corrida com valores padrão e personalizados', () => {
    const options: Partial<EstimateRideInput> = {
      origin: 'Rua A',
    };
    const input = createEstimateRideInput(options);
    expect(input).toHaveProperty('customerId');
    expect(input.origin).toBe(options.origin);
    expect(typeof input.destination).toBe('string');
  });
});
