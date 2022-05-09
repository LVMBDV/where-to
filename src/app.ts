import fastify from "fastify"
import mongoosePlugin, { DecoratedWithMongoose, MongoosePluginOptions } from "./helpers/MongoosePlugin"
import routes from "./routes"
import schemas from "./schemas"

declare module "fastify" {
  // It's not empty, it merges DecoratedWithMongoose into FastifyInstance :)
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface FastifyInstance extends DecoratedWithMongoose {}
}

/**
 * Sets up the fastify instance and waits for it to be ready.
 * @returns The ready fastify instance.
 *
 * @remarks
 * This function will fail if it fails to connect to MongoDB on initialization.
 *
 */
export default async () => {
  const app = fastify({
    logger: process.env.NODE_ENV !== "test"
  })

  const mongooseOptions: MongoosePluginOptions = {
    uri: process.env.MONGO_URI ?? "mongodb://localhost:27017/where-to",
    options: {
      autoIndex: false,
      connectTimeoutMS: 1000,
      serverSelectionTimeoutMS: 1000
    }
  }

  await app.register(mongoosePlugin, mongooseOptions)
  for (const name in schemas) {
    const model = app.mongoose.model(name, schemas[name])
    await model.ensureIndexes()
  }

  for (const route of routes) {
    await app.register(route)
  }

  await app.ready()

  return app
}