import { Schema } from "mongoose"

// A subschema for GeoJSON Point features.
export default new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator(value: number[]) {
        return value.length === 2
      },
      message: ({ value }: { value: number[]}) => `GeoJSON Point ${value} must have 2 elements, not ${value.length}!`
    },
  }
})

export type LngLat = [lng: number, lat: number]