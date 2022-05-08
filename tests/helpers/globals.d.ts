/* eslint-disable no-var */
import { FastifyInstance } from "fastify"
import { MongoMemoryServer } from "mongodb-memory-server"
import "jest-extended"
import { City } from "../../src/schemas/City"
import GeoNearby from "geo-nearby"

declare global {
  var app: FastifyInstance
  var mongoServer: MongoMemoryServer
  var cities: City[]
  var cityLocations: GeoNearby
}