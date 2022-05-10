import { FastifyPluginAsync } from "fastify"
import suggestions from "./suggestions"
import ping from "./ping"

const routes: FastifyPluginAsync[] = [
  suggestions
]

if (process.env.NODE_ENV === "test") {
  routes.push(ping)
}

export default routes