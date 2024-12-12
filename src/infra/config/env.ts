import dotenv from 'dotenv';

dotenv.config();
export function getEnvVariable(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key];
  if (value === undefined || value === null) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}
export const env = {
  googleMapsApiKey: getEnvVariable('GOOGLE_MAPS_API_KEY'),
};
