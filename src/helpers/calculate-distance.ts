import { LngLat } from "../schemas/subschemas/Point"

function rad(degrees: number): number {
  return degrees * Math.PI / 180
}

/**
 * Calculate the bird-eye distance between two points.
 *
 * @param lhs - Coordinate pair of the origin.
 * @param rhs - Coordinate pair of the destination.
 * @returns Distance between the two points.
 *
 * @remarks
 * Note that the coordinate pairs are in the form of [longitude, latitude], as per WGS84.
 *
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 */
export default function distanceBetween(lhs: LngLat, rhs: LngLat) {
  const { abs, sin, cos, atan2, sqrt } = Math

  const diffLng = rad(rhs[0] - lhs[0])
  const diffLat = rad(rhs[1] - lhs[1])

  const a = abs( // Close your eyes.
    sin(diffLat/2) * sin(diffLat/2)
    +
    cos(rad(lhs[1])) * cos(rad(rhs[1]))
      * sin(diffLng / 2) * sin(diffLat /2))

  const c = 2 * atan2(sqrt(a), sqrt(1 - a))
  return 6371 * c
}