/* eslint-disable */
const { MongoMemoryServer } = require("mongodb-memory-server")
const setupApp = require("../../src/app").default
const GeoNearby = require("geo-nearby")

try {
  globalThis.cities = require("../../data/cities_canada-usa.json")
} catch (error) {
  throw new Error("Could not load city location data. Have you run `npm run build:data`?")
}

globalThis.cityLocations = new GeoNearby(GeoNearby.createCompactSet(cities.map((city) => {
  return [city.location[1], city.location[0], city.name]
})))

module.exports = async () => {
  globalThis.mongoServer = await MongoMemoryServer.create()
  process.env.MONGO_URI = globalThis.mongoServer.getUri()

  globalThis.app = await setupApp()

  const City = globalThis.app.mongoose.models.City
  await City.syncIndexes()
  await City.insertMany(cities)
}