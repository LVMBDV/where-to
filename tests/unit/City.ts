import { Document } from "mongoose"
import { City as CityObject, CityModel } from "../../src/schemas/City"

type CityDocument = Document<CityObject>

let City: CityModel

function cityDocumentToObject(document: CityDocument): CityObject {
  const object = document.toObject({ versionKey: false })
  delete object._id
  delete object.location._id

  return object as CityObject
}

describe("City", () => {
  beforeAll(() => {
    City = app.mongoose.models.City as CityModel
  })

  describe("#find()", () => {
    describe("#byName", () => {
      it("should match by name",async () => {
        const results = (await City.find().byName("Gaspé")).map(cityDocumentToObject)
        expect(results).toIncludeAllMembers(cities.filter((city) => /Gaspé/i.test(city.name)))
      })

      it("should match by name case-insensitively ",async () => {
        const results = (await City.find().byName("hot springs national park")).map(cityDocumentToObject)
        expect(results).toIncludeAllMembers(cities.filter((city) => /hot springs national park/i.test(city.name)))
      })

      it("should match by partial name",async () => {
        const results = (await City.find().byName("Fort")).map(cityDocumentToObject)
        expect(results).toIncludeAllMembers(cities.filter((city) => /Fort/i.test(city.name)))
      })

      it("should match by ascii name",async () => {
        const results = (await City.find().byName("Gaspe")).map(cityDocumentToObject)
        expect(results).toIncludeAllMembers(cities.filter((city) => /Gaspe/i.test(city.ascii_name)))
      })

      it("should match by alternative name",async () => {
        const results = (await City.find().byName("big apple")).map(cityDocumentToObject)
        expect(results).toIncludeAllMembers(cities.filter((city) => {
          return city.alternative_names.some((name) => /big apple/i.test(name))
        }))
      })
    })

    describe("#byProximity", () => {
      it("should match by proximity", async () => {
        const results = (await City.find().byProximity([-117.705898, 34.702607], 100)).map(cityDocumentToObject)
        expect(results.map((result: CityObject) => result.name))
          .toIncludeAllMembers(await cityLocations.nearBy(-117.705898, 34.702607, 100))
      })

      it("should find zero results if given 0 km as radius", async () => {
        const results = (await City.find().byProximity([-117.705898, 34.702607], 0)).map(cityDocumentToObject)
        expect(results).toBeEmpty()
      })
    })
  })
})