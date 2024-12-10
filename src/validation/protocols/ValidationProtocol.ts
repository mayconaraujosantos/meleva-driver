import { type EstimateRideInput } from '@/domain/models/EstimateRideInput';

export interface ValidationProtocol {
  validate: (input: EstimateRideInput) => void;
}
