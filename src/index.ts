import app from "./app";

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3006;
const HOST = process.env.HOST || "0.0.0.0";

app.listen({ port: FASTIFY_PORT, host: HOST }, (err: Error | null, address:
    string) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`✅ Paystack Headless Payment running on port ${address}`)
})