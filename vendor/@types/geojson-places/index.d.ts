declare module "geojson-places" {
  export function lookUp(lat: number, lng: number): null | {
    continent_code: string
    country_a2: string
    country_a3: string
    region_code: string
    state_code: string
  }

  export function getStateByCode(stateCode: string): null | {
    state_code: string
    state_name: string
  }

  export function getCountryByAlpha2(countryCode: string): null | {
    country_a2: string
    country_a3: string
    country_name: string
  }
}