import fastify, { FastifyInstance } from "fastify"
import { plugin as fastifyMongoose, Options as FastifyMongooseOptions, Decorator as MongooseDecorator } from "@ederzadravec/fastify-mongoose"
import routes from "./routes"
import models from "./models"

interface FastifyInstanceWithMongoose extends FastifyInstance {
  mongoose: MongooseDecorator
}

const app = fastify({
  logger: true
})

const mongooseOptions: FastifyMongooseOptions = {
  uri: process.env.MONGO_URI ?? "mongodb://localhost:27017/where-to",
  settings: { autoIndex: false },
  models
}

app.register(fastifyMongoose, mongooseOptions)

for (const route of routes) {
  app.register(route)
}

app.ready((error?: Error) => {
  if (error !== undefined) {
    throw error
  }

  const appWithMongoose = app as unknown as FastifyInstanceWithMongoose
  if (appWithMongoose.mongoose.instance === undefined) {
    throw new Error("Mongoose instance is undefined. Failed to connect to mongoDB.")
  }
})

export default app