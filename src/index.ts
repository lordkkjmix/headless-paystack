import app from "./app";

const PORT = Number(process.env.PORT) || 3006;
const HOST = process.env.HOST || "0.0.0.0";

app.listen({ port: PORT, host: HOST }, (err: Error | null, address:
    string) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`✅ Paystack Headless Payment running on port ${address}`)
})