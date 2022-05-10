import { FastifyInstance } from "fastify"

export default async (app: FastifyInstance) => {
  app.route({
    method: "GET",
    url: "/ping",
    handler: async (_, reply) => {
      reply.send("pong")
    }
  })
}