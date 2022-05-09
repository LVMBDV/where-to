import { connect, ConnectOptions, Mongoose } from "mongoose"
import { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"

/**
 * A simple Mongoose plugin for Fastify.
 *
 * @param fastify - Fastify instance.
 * @param options.uri - MongoDB URI to connect to, e.g. "mongodb://localhost:27017/test".
 * @param options.options - Options to pass to the MongoDB driver.
 */
const plugin: FastifyPluginAsync<MongoosePluginOptions> = async (fastify, { uri, options }) => {
  const mongoose: Mongoose = await connect(uri, options)

  fastify.addHook("onClose", async () => {
    await mongoose.connection.close()
  })

  fastify.decorate("mongoose", mongoose)
}

export interface DecoratedWithMongoose {
  mongoose: Mongoose
}

export interface MongoosePluginOptions {
  uri: string,
  options?: ConnectOptions
}

export default fp(plugin)