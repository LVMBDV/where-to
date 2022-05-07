import fastify from "fastify"
import mongoosePlugin, { DecoratedWithMongoose, MongoosePluginOptions } from "./helpers/MongoosePlugin"
import routes from "./routes"
import schemas from "./schemas"

declare module "fastify" {
  // It's not empty, it merges DecoratedWithMongoose into FastifyInstance :)
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface FastifyInstance extends DecoratedWithMongoose {}
}

export default async () => {
  const app = fastify({
    logger: true
  })

  const mongooseOptions: MongoosePluginOptions = {
    uri: process.env.MONGO_URI ?? "mongodb://localhost:27017/where-to",
    options: {
      autoIndex: false,
      connectTimeoutMS: 1000,
      serverSelectionTimeoutMS: 1000
    }
  }

  app.register(mongoosePlugin, mongooseOptions)
  app.after(() => {
    for (const name in schemas) {
      app.mongoose.model(name, schemas[name])
    }
  })

  for (const route of routes) {
    app.register(route)
  }

  await app.ready()

  return app
}