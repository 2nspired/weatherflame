export interface WeatherApiResponse {
  '@context': {
    '@version': string; // Example: "1.1"
  };
  type: 'FeatureCollection'; // Always "FeatureCollection"
  features: Feature[];
}

export interface Feature {
  id: string; // Example: "https://api.weather.gov/zones/county/MNC137"
  type: 'Feature'; // Always "Feature"
  geometry: null; // Assuming geometry is null in this response
  properties: FeatureProperties;
}

export interface FeatureProperties {
  '@id': string; // Example: "https://api.weather.gov/zones/county/MNC137"
  '@type': 'wx:Zone'; // Always "wx:Zone"
  id: string; // Example: "MNC137"
  type: 'county' | 'fire' | 'public'; // Enum for different zone types
  name: string; // Example: "St. Louis" or "Carlton/South St. Louis"
  effectiveDate: string; // ISO8601 date-time string, e.g., "2024-03-05T18:00:00+00:00"
  expirationDate: string; // ISO8601 date-time string, e.g., "2200-01-01T00:00:00+00:00"
  state: string; // Example: "MN"
  forecastOffice: string; // Example: "https://api.weather.gov/offices/DLH"
  gridIdentifier: string; // Example: "DLH"
  awipsLocationIdentifier: string; // Example: "DLH"
  cwa: string[]; // Example: ["DLH"]
  forecastOffices: string[]; // Example: ["https://api.weather.gov/offices/DLH"]
  timeZone: string[]; // Example: ["America/Chicago"]
  observationStations: string[]; // URLs of observation stations
  radarStation: string | null; // Example: "DLH" or null
}
