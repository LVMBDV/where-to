const rateLimit = parseInt(process.env.RATE_LIMIT ?? "") || 5
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - @types/jest is not available for jest 28 yet :(
jest.useFakeTimers({
  advanceTimers: true
})

describe("/ping", () => {
  it("should send status code 429 when rate limit is reached", async () => {
    for (let i = 0; i < rateLimit; i++) {
      await expect(app.inject({
        method: "GET",
        url: "/ping"
      })).resolves.toHaveProperty("statusCode", 200)
    }

    await expect(app.inject({
      method: "GET",
      url: "/ping"
    })).resolves.toHaveProperty("statusCode", 429)
  })

  it("should succeed after rate limit is reset after the set interval", async () => {
    await expect(app.inject({
      method: "GET",
      url: "/ping"
    })).resolves.toHaveProperty("statusCode", 429)

    jest.advanceTimersByTime(60 * 1000)
    await expect(app.inject({
      method: "GET",
      url: "/ping"
    })).resolves.toHaveProperty("statusCode", 200)

  })
})