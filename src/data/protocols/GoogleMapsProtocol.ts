import { type GoogleMapsRouteResponse } from './google-maps/GoogleMapsRouteResponse';

export interface GoogleMapsProtocol {
  calculateRoute: (origin: string, destination: string) => Promise<GoogleMapsRouteResponse>;
}
