import { Document, Model, Query, Schema } from "mongoose"
import Point, { LngLat } from "./subschemas/Point"
import escapeStringRegexp from "escape-string-regexp"

export interface City {
  name: string
  ascii_name: string
  alternative_names: string[]
  location: {
    type: "Point"
    coordinates: LngLat
  }
  country_code: string
  region_code?: string
  state_code?: string
}

interface CityQueryHelpers {
  byName(name: string): CityQuery
  byProximity(location: LngLat, kmRadius: number): CityQuery
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CityQuery = Query<any, Document<City>> & CityQueryHelpers

export type CityModel = Model<City, CityQueryHelpers>

const citySchema = new Schema<City, CityModel, unknown, CityQueryHelpers>({
  name: {
    type: String,
    required: true
  },
  ascii_name: {
    type: String,
    required: true
  },
  alternative_names: {
    type: [String]
  },
  location: {
    type: Point,
    required: true,
    index: "2dsphere"
  },
  country_code: {
    type: String,
    required: true
  },
  region_code: {
    type: String
  },
  state_code: {
    type: String
  }
})

/**
 * Search for cities with a given name.
 *
 * @param query - Name to search for, can be partial.
 * @param prefixSearch - Whether to only search for a match in the beginning of
 * a name, or anywhere in the name. Prefix search is more performant.
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/regex/#index-use
 *
 * @returns Chainable query object.
 *
 * @remarks
 * The given query is matched case-insensitively against the name of the city
 * with local characters, the ASCII equivalent of the name, and its alternative
 * names e.g. "Big Apple" for "New York City". Results with any partial matches
 * are returned.
 */
citySchema.query.byName = function(query: string, prefixSearch = false): CityQuery {
  const queryPattern = new RegExp((prefixSearch ? "^" : "") + escapeStringRegexp(query), "i")

  return this.where({
    $or: [
      { name: { $regex: queryPattern } },
      { ascii_name: { $regex: queryPattern } },
      { alternative_names: { $elemMatch: { $regex: queryPattern } } }
    ]
  })
}

/**
 * Search for cities within a given radius of a given location.
 *
 * @param location - Coordinate pair of the location to search around
 * @param radius - Radius in kilometers
 * @returns Chainable query object
 */
citySchema.query.byProximity = function(location: LngLat, radius: number): CityQuery {
  return this.where({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: location
        },
        $maxDistance: radius * 1000
      }
    }
  })
}

export default citySchema