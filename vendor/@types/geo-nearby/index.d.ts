declare module "geo-nearby" {
  export default class Geo<T = unknown> {
    nearBy(latitude: number, longitude: number, distance: number): Promise<T[]>
  }
}
