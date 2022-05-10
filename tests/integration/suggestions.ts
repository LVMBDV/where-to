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

  if (response.statusCode !== 200) {
    throw new Error(response.body)
  }

  return response.json<SuggestionsResponse>().suggestions as Suggestion[]
}

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
})