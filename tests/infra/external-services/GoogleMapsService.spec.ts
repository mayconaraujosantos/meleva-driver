import { type GoogleMapsAPIResponse } from '@/data/protocols/google-maps/GoogleMapsAPIResponse';
import { GoogleMapsApiStatus } from '@/data/protocols/google-maps/GoogleMapsApiStatus';
import { type GoogleMapsRouteResponse } from '@/data/protocols/google-maps/GoogleMapsRouteResponse';
import { env } from '@/infra/config/env';
import GoogleMapsService from '@/infra/external-services/GoogleMapsService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const GOOGLE_MAPS_KEY = env.googleMapsApiKey;

let googleMapsService: GoogleMapsService;

beforeEach(() => {
  googleMapsService = new GoogleMapsService();
});

describe('GoogleMapsService - validateGoogleMapsKey', () => {
  it('should throw an error if the API key is empty', () => {
    expect(() => googleMapsService.validateGoogleMapsKey('')).toThrow('Google Maps API key is required');
  });

  it('should throw an error if the API key is undefined', () => {
    expect(() => googleMapsService.validateGoogleMapsKey(undefined as unknown as string)).toThrow('Google Maps API key is required');
  });

  it('should return the key if it is valid', () => {
    const validKey = 'valid_key';
    expect(googleMapsService.validateGoogleMapsKey(validKey)).toBe(validKey);
  });
});

describe('GoogleMapsService - buildUrl', () => {
  it('should construct a valid URL with the given origin, destination, and API Key', () => {
    const origin = 'New York';
    const destination = 'Los Angeles';
    const apiKey = 'valid_api_key';
    const url = googleMapsService.buildUrl(origin, destination, apiKey);
    expect(url).toBe(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`);
  });
});

describe('GoogleMapsService - fetchRouteData', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it('should fetch route data from the Google Maps API', async () => {
    const mockResponse = {
      routes: [{ legs: [{ distance: { value: 1000, text: '1 km' }, duration: { value: 600, text: '10 min' } }] }],
      status: GoogleMapsApiStatus.OK,
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const url = googleMapsService.buildUrl('New York', 'Los Angeles', GOOGLE_MAPS_KEY);
    const data = await googleMapsService.fetchRouteData(url);
    expect(data).toEqual(mockResponse);
    expect(fetchMock).toHaveBeenCalledWith(url);
  });
  it('should throw an error if the response status is not OK', async () => {
    const mockResponse = {
      status: GoogleMapsApiStatus.ZERO_RESULTS,
      routes: [],
    };
    expect(() => {
      googleMapsService.handleGoogleMapsApiError(mockResponse);
    }).toThrow('No route could be found between the origin and destination.');
  });

  it('should throw an error if the response is not JSON', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });
    await expect(googleMapsService.fetchRouteData('https://mock-url.com')).rejects.toThrow('Unexpected error fetching route data');
  });
});

describe('GoogleMapsService - parseRouteData', () => {
  it('should parse the route data correctly when valid data is provided', () => {
    const mockData: GoogleMapsAPIResponse = {
      routes: [
        {
          legs: [
            {
              distance: { value: 1000, text: '1 km' },
              duration: { value: 600, text: '10 min' },
              start_location: { lat: 40.7128, lng: -74.006 },
              end_location: { lat: 34.0522, lng: -118.2437 },
            },
          ],
        },
      ],
      status: GoogleMapsApiStatus.OK,
    };
    const result = googleMapsService.parseRouteData(mockData);

    expect(result).toEqual({
      legs: [
        {
          distance: { value: 1, text: '1 km' },
          duration: { value: 600, text: '10 min' },
          start_location: { lat: 40.7128, lng: -74.006 },
          end_location: { lat: 34.0522, lng: -118.2437 },
        },
      ],
    });
  });
  it('should throw an error if routes are not an array', () => {
    const invalidData: GoogleMapsAPIResponse = {
      routes: null as unknown as GoogleMapsRouteResponse[],
      status: GoogleMapsApiStatus.OK,
    };
    expect(() => googleMapsService.parseRouteData(invalidData)).toThrow('No routes found in the response from Google Maps API.');
  });
  it('should throw an error if routes array is empty', () => {
    const invalidData: GoogleMapsAPIResponse = {
      routes: [],
      status: GoogleMapsApiStatus.OK,
    };
    expect(() => googleMapsService.parseRouteData(invalidData)).toThrow('No routes found in the response from Google Maps API.');
  });
});

describe('GoogleMapsService - calculateRoute', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should calculate the route successfully', async () => {
    const mockResponse = {
      routes: [
        {
          legs: [
            {
              distance: { value: 1000, text: '1 km' },
              duration: { value: 600, text: '10 min' },
              start_location: { lat: 40.7128, lng: -74.006 },
              end_location: { lat: 34.0522, lng: -118.2437 },
            },
          ],
        },
      ],
      status: GoogleMapsApiStatus.OK,
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const route = await googleMapsService.calculateRoute('New York', 'Los Angeles');

    expect(route).toEqual({
      legs: [
        {
          distance: { value: 1, text: '1 km' },
          duration: { value: 600, text: '10 min' },
          start_location: { lat: 40.7128, lng: -74.006 },
          end_location: { lat: 34.0522, lng: -118.2437 },
        },
      ],
    });
  });
});

describe('GoogleMapsService - handleGoogleMapsApiError', () => {
  it('should throw an error for an unknown Google Maps API status', () => {
    const mockResponse: GoogleMapsAPIResponse = {
      status: 'UNKNOWN_STATUS' as GoogleMapsApiStatus,
      routes: [],
    };
    expect(() => {
      googleMapsService.handleGoogleMapsApiError(mockResponse);
    }).toThrow('Unknown Google Maps API error: UNKNOWN_STATUS');
  });
});
