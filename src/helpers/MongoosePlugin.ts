import { connect, ConnectOptions, Mongoose } from "mongoose"
import { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"

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