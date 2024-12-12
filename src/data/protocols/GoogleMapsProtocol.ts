export interface GoogleMapsProtocol {
  calculateRoute: (origin: string, destination: string) => Promise<GoogleMapsRouteResponse>;
}
export interface Geolocation {
  lat: number;
  lng: number;
}

export enum GoogleMapsApiStatus {
  OK = 'OK',
  ZERO_RESULTS = 'ZERO_RESULTS',
}
export interface GoogleMapsRouteResponse {
  legs: Array<{
    distance: { value: number; text: string };
    duration: { value: number; text: string };
    start_location: Geolocation;
    end_location: Geolocation;
  }>;
}

export interface GoogleMapsAPIResponse {
  routes: GoogleMapsRouteResponse[];
  status: GoogleMapsApiStatus;
  error_message?: string;
}
