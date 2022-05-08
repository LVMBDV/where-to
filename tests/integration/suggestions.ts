import { Suggestion, SuggestionArguments } from "../../src/routes/suggestions"

interface SuggestionsResponse {
  suggestions: Suggestion[]
}

async function fetchSuggestions(query: Partial<SuggestionArguments>): Promise<Suggestion[]> {
  const response = await app.inject({
    method: "GET",
    url: "/suggestions",
    query: Object.fromEntries(Object.entries({ sort: "name", ...query }).map(([key, value]) => [key, value.toString()]))
  })

  return response.json<SuggestionsResponse>().suggestions as Suggestion[]
}

describe("/suggestions", () => {
  it("should return suggestions", async () => {
    const suggestions = await fetchSuggestions({ query: "London" })
    expect(suggestions).toSatisfyAll((suggestion) => /London/.test(suggestion.name))
  })
})