import { type GoogleMapsApiStatus } from './GoogleMapsApiStatus';
import { type GoogleMapsRouteResponse } from './GoogleMapsRouteResponse';

export interface GoogleMapsAPIResponse {
  routes: GoogleMapsRouteResponse[];
  status: GoogleMapsApiStatus;
  error_message?: string;
}
