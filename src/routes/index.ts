import { FastifyPluginAsync } from "fastify"
import suggestions from "./suggestions"

const routes: FastifyPluginAsync[] = [
  suggestions
]

export default routes