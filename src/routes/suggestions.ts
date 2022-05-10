import { FastifyInstance } from "fastify"
import { City, CityModel } from "../schemas/City"
import distanceBetween from "../helpers/calculate-distance"
import { getStateByCode, getCountryByAlpha2 } from "geojson-places"
import { LngLat } from "../schemas/subschemas/Point"

export interface SuggestionArguments {
  query: string
  latitude?: number
  longitude?: number
  radius?: number
  sort: "name" | "distance"
}

export interface Suggestion {
  name: string
  latitude: number
  longitude: number
  distance?: number
}

export function cityToSuggestion(city: City, coordinates?: Partial<LngLat>): Suggestion {
  const [longitude, latitude] = coordinates ?? []

  const suggestion: Suggestion = {
    name: [
      city.name,
      getStateByCode(city.state_code ?? "")?.state_name ?? "",
      getCountryByAlpha2(city.country_code)?.country_name ?? ""
    ].join(", "),
    latitude: city.location.coordinates[1],
    longitude: city.location.coordinates[0]
  }

  if (longitude !== undefined && latitude !== undefined) {
    suggestion.distance = distanceBetween(city.location.coordinates, [longitude, latitude])
  }

  return suggestion
}

export default async (app: FastifyInstance) => {
  app.route({
    method: "GET",
    url: "/suggestions",
    schema: {
      querystring: {
        type: "object",
        properties: {
          query: {
            type: "string",
            minLength: 1
          },
          latitude: {
            type: "number",
            minimum: -90,
            maximum: 90
          },
          longitude: {
            type: "number",
            minimum: -180,
            maximum: 180
          },
          radius: { // in kilometers
            type: "number",
            minimum: 0,
            maximum: 1000 // a sane limit
          },
          sort: {
            type: "string",
            default: "name"
          }
        },
        required: ["query"],
        // Latitude, longitude and radius must be provided together, if any.
        dependentRequired: {
          "latitude": ["longitude", "radius"],
          "longitude": ["latitude", "radius"],
          "radius": ["latitude", "longitude"],
        },
        // Results can only be sorted by name when positional arguments are not provided.
        anyOf: [
          {
            required: ["radius"],
            properties: {
              sort: { enum: ["name", "distance"] }
            }
          },
          {
            properties: {
              sort: { const: "name" }
            }
          }
        ]
      }
    },
    handler: async (request, reply) => {
      const { query, latitude, longitude, radius, sort } = request.query as SuggestionArguments

      let cityQuery = (app.mongoose.models.City as CityModel).find().byName(query)

      if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
        cityQuery = cityQuery.byProximity([longitude, latitude], radius)
      }

      if (sort === "name") {
        cityQuery.sort({ name: "asc" })
      }

      // Transform found City documents into Suggestion objects.
      cityQuery.transform((cities) => {
        return cities.map((city: City) => cityToSuggestion(city, [longitude, latitude]))
      })

      const suggestions = await cityQuery.exec()

      if (sort === "distance") {
        suggestions.sort((a: Suggestion, b: Suggestion) => a.distance! - b.distance!)
      }

      reply.send({
        suggestions
      })
    }
  })
}