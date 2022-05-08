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

citySchema.query.byName = function(query: string): CityQuery {
  const queryPattern = new RegExp(escapeStringRegexp(query), "i")

  return this.where({
    $or: [
      { name: { $regex: queryPattern } },
      { ascii_name: { $regex: queryPattern } },
      { alternative_names: { $elemMatch: { $regex: queryPattern } } }
    ]
  })
}

citySchema.query.byProximity = function(location: LngLat, kmRadius: number): CityQuery {
  return this.where({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: location
        },
        $maxDistance: kmRadius * 1000
      }
    }
  })
}

export default citySchema