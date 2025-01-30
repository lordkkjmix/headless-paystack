import fastify from "fastify";
import router from "./routers";

const server = fastify({
    // Logger only for production
    logger: !!(process.env.NODE_ENV !== "development"),
});

// Middleware: Router
server.register(router);

export default server;