declare module "geojson-places" {
  export interface LookUpResult {
    continent_code: string
    country_a2: string
    country_a3: string
    region_code: string
    state_code: string
  }

  export function lookUp(lat: number, lng: number): LookUpResult | null
}