import { type GoogleMapsProtocol } from '@/data/protocols/GoogleMapsProtocol';
import { type GoogleMapsAPIResponse } from '@/data/protocols/google-maps/GoogleMapsAPIResponse';
import { GoogleMapsApiStatus } from '@/data/protocols/google-maps/GoogleMapsApiStatus';
import { type GoogleMapsRouteResponse } from '@/data/protocols/google-maps/GoogleMapsRouteResponse';
import { env } from '@/infra/config/env';
import { ValidationError } from '@/presentation/errors/ValidationError';

export class GoogleMapsService implements GoogleMapsProtocol {
  handleGoogleMapsApiError(data: GoogleMapsAPIResponse): void {
    switch (data.status) {
      case GoogleMapsApiStatus.OK:
        return;
      case GoogleMapsApiStatus.ZERO_RESULTS:
        throw new Error('No route could be found between the origin and destination.');
      default:
        throw new Error(`Unknown Google Maps API error: ${data.status as string}`);
    }
  }

  private readonly GOOGLE_MAPS_ENDPOINT: string = 'https://maps.googleapis.com/maps/api/directions/json';
  private readonly METERS_TO_KILOMETERS: number = 1000;
  private readonly GOOGLE_MAPS_KEY: string = env.googleMapsApiKey;

  public async calculateRoute(origin: string, destination: string): Promise<GoogleMapsRouteResponse> {
    this.validateGoogleMapsKey(this.GOOGLE_MAPS_KEY);
    const url: string = this.buildUrl(origin, destination, this.GOOGLE_MAPS_KEY);
    const data = await this.fetchRouteData(url);
    return this.parseRouteData(data);
  }

  public validateGoogleMapsKey(GOOGLE_MAPS_KEY: string): string {
    if (GOOGLE_MAPS_KEY === '' || GOOGLE_MAPS_KEY === undefined) {
      throw new Error('Google Maps API key is required');
    }
    return GOOGLE_MAPS_KEY;
  }

  public parseRouteData(data: GoogleMapsAPIResponse): GoogleMapsRouteResponse {
    if (!Array.isArray(data.routes) || data.routes.length === 0) {
      throw new Error('No routes found in the response from Google Maps API.');
    }
    const { legs } = data.routes[0];
    const { distance, duration, start_location: startLocation, end_location: endLocation } = legs[0];
    return {
      legs: [
        {
          distance: { value: distance.value / this.METERS_TO_KILOMETERS, text: distance.text },
          duration: { value: duration.value, text: duration.text },
          start_location: startLocation,
          end_location: endLocation,
        },
      ],
    };
  }

  public async fetchRouteData(url: string): Promise<GoogleMapsAPIResponse> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch route data. HTTP Status: ${response.status}, Message: ${response.statusText}`);
      }
      const data: GoogleMapsAPIResponse = await response.json();
      this.handleGoogleMapsApiError(data);
      return data;
    } catch (error: any) {
      throw new ValidationError(`Unexpected error fetching route data: ${error.error_message}`);
    }
  }

  public buildUrl(origin: string, destination: string, GOOGLE_MAPS_KEY: string): string {
    return `${this.GOOGLE_MAPS_ENDPOINT}?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_KEY}`;
  }
}

export default GoogleMapsService;
