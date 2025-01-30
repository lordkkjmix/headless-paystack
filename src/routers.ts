import { FastifyInstance } from "fastify";
import indexController from "./controllers/indexController";
import apiController from "./controllers/apiController";
import fastifyCookie from "@fastify/cookie";
import fastifyCsrfProtection from "@fastify/csrf-protection";
const path = require('node:path')
export default async function router(fastify: FastifyInstance) {
    fastify.register(fastifyCookie);
    fastify.register(fastifyCsrfProtection);
    fastify.register(indexController, { prefix: "/" });
    fastify.register(apiController, { prefix: "/api/v1/" });
    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, 'public'),
        prefix: '/public/'
    })
}