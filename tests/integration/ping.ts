describe("/ping", () => {
  it("should pong", async () => {
    await expect(app.inject({
      method: "GET",
      url: "/ping"
    })).resolves.toHaveProperty("body", "pong")
  })
})