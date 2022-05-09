import setupApp from "./app"

(async() => {
  const app = await setupApp()

  try {
    await app.listen(
      process.env.NODE_PORT ?? 3000,
      process.env.NODE_HOST ?? "localhost")
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
})()