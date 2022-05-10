import { Suggestion, SuggestionArguments, cityToSuggestion } from "../../src/routes/suggestions"

interface SuggestionsResponse {
  suggestions: Suggestion[]
}

async function fetchSuggestions(query: Partial<SuggestionArguments>): Promise<Suggestion[]> {
  const response = await app.inject({
    method: "GET",
    url: "/suggestions",
    query: Object.fromEntries(Object.entries({ sort: "name", ...query }).map(([key, value]) => [key, value.toString()]))
  })
  jest.advanceTimersByTime(60 * 1000)

  if (response.statusCode !== 200) {
    throw new Error(response.body)
  }

  return response.json<SuggestionsResponse>().suggestions as Suggestion[]
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - @types/jest is not available for jest 28 yet :(
jest.useFakeTimers({
  advanceTimers: true
})

describe("/suggestions", () => {
  it("should not accept empty or undefined query argument", async () => {
    expect(() => fetchSuggestions({ query: "" })).rejects
    expect(() => fetchSuggestions({})).rejects
  })

  it("should not accept partial positional arguments", async () => {
    expect(fetchSuggestions({ query: "London", longitude: 45.23 })).rejects
    expect(fetchSuggestions({ query: "London", latitude: -58.21 })).rejects
    expect(fetchSuggestions({ query: "London", radius: 3 })).rejects
  })

  it("should return correct suggestions for non-positional query", async () => {
    const suggestions = await fetchSuggestions({ query: "London" })
    expect(suggestions).toIncludeAllMembers(cities.filter((city) => /London/i.test(city.name)).map((city) => cityToSuggestion(city)))
  })

  it("should return the correct suggestion for positional query with a small radius", async () => {
    const suggestions = await fetchSuggestions({
      query: "London",
      latitude: 42.98,
      longitude: -81.23,
      radius: 10
    })

    expect(suggestions).toHaveLength(1)
    expect(suggestions[0]).toHaveProperty("name", "London, Ontario, Canada")
  })

  it("should sort suggestions by name if not specified", async () => {
    const suggestions = await fetchSuggestions({ query: "London" })
    expect(suggestions).toStrictEqual(cities
      .filter((city) => /London/i.test(city.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((city) => cityToSuggestion(city)))
  })

  it("should sort suggestions by distance if specified", async () => {
    const [lng, lat] = [-81.23, 42.98]
    const suggestions = await fetchSuggestions({
      query: "London",
      latitude: lat,
      longitude: lng,
      radius: 1000,
      sort: "distance"
    })
  })
})