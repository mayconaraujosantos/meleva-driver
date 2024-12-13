import { type MapLocation } from './MapLocation';

export interface GoogleMapsRouteResponse {
  legs: Array<{
    distance: { value: number; text: string };
    duration: { value: number; text: string };
    start_location: MapLocation;
    end_location: MapLocation;
  }>;
}
