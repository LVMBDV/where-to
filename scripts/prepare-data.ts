import { createReadStream, createWriteStream } from "fs"
import { parse, transform } from "csv"
import { resolve } from "path"
import { lookUp } from "geojson-places"
import AsciiBar from "ascii-bar"
import { execSync } from "child_process"
import { City } from "../src/schemas/City"

const totalLineCount = parseInt(
  execSync(`wc -l "${resolve(__dirname, "../data/cities_canada-usa.tsv")}"`)
    .toString()
    .split(/\s+/)[0])

const progressBar = isNaN(totalLineCount) ? undefined : new AsciiBar({
  formatString: "#percent #bar #message",
  total: totalLineCount,
  autoStop: true
})

progressBar?.update(0, "Preparing JSON data from TSV...")

const input = createReadStream(resolve(__dirname, "../data/cities_canada-usa.tsv"))
const parser = parse({
  columns: true,
  delimiter: "\t",
  quote: null
})
const output = createWriteStream(resolve(__dirname, "../data/cities_canada-usa.json"))
const transformer = transform((record, callback) => {
  const result: City = {
    name: record.name,
    ascii_name: record.ascii,
    alternative_names: (record.alt_name.length > 0) ? record.alt_name.split(",") : [],
    location: {
      type: "Point",
      coordinates: [
        parseFloat(record.long),
        parseFloat(record.lat)
      ]
    },
    country_code: record.country
  }

  const [lng, lat] = result.location.coordinates
  const place = lookUp(lat, lng)

  if (place !== null) {
    result.region_code = place.region_code
    result.state_code = place.state_code

    if (place.country_a2 !== undefined && result.country_code !== place.country_a2) {
      result.country_code = place.country_a2
    }
  }

  progressBar?.update(parser.info.lines)
  const endLine = (parser.info.lines === totalLineCount) ? "\n]" : ",\n"
  callback(null, "  " + JSON.stringify(result) + endLine)
})


output.write("[\n")
input.pipe(parser).pipe(transformer).pipe(output)