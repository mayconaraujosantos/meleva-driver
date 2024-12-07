import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';
import { faker } from '@faker-js/faker';

export const createEstimateRideInput = (options?: Partial<EstimateRideInput>): EstimateRideInput => {
  const defaultOptions: EstimateRideInput = {
    customerId: faker.string.numeric(),
    origin: faker.location.streetAddress(),
    destination: faker.location.streetAddress(),
  };

  return {
    ...defaultOptions,
    ...options,
  };
};
