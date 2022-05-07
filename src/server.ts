import app from "./app"

(async() => {
  try {
    const address = await app.listen(
      process.env.NODE_PORT ?? 3000,
      process.env.NODE_HOST ?? "localhost")

    app.log.info(`Server listening on "${address}".`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
})()