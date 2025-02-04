import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { promises } from "fs";
import { resolve } from "path";
import { ProcessParams } from "../types";
const { readFile } = promises;

export default async function indexController(fastify: FastifyInstance) {
    // GET /
    fastify.get("/payment", {
        schema: {
            querystring: {
                type: "object",
                properties: {
                    paymentLink: {
                        type: "string",
                        description: "Payment link",
                    },
                    phoneNumber: {
                        type: "string",
                        description: "Phone number",
                        nullable: true,
                    },
                    callback: {
                        type: "string",
                        description: "Callback URL",
                        nullable: true,
                    },
                },
            },
        },
    }, async (
        _request: FastifyRequest<{ Params: ProcessParams }>,
        reply: FastifyReply,
    ) => {
        const indexHtmlPath = resolve(__dirname, "../../static/payment.html");
        const indexHtmlContent = await readFile(indexHtmlPath);
        const defaultCallbackUrl = process.env.CALLBACK_URL ?? "/";
        const updatedHtmlContent = indexHtmlContent.toString().replace(
            '{{callbackUrl}}',
            defaultCallbackUrl
        );
        console.log(updatedHtmlContent);
        reply
            .header("Content-Type", "text/html; charset=utf-8")
            .send(updatedHtmlContent);
    });
    fastify.get("/", {
    }, async (
        _request: FastifyRequest<{ Params: ProcessParams }>,
        reply: FastifyReply,
    ) => {
        const indexHtmlPath = resolve(__dirname, "../../static/index.html");
        const indexHtmlContent = await readFile(indexHtmlPath);
        const csrfToken = await reply.generateCsrf()
        const logo = process.env.LOGO_URL ?? 'https://permanentinnovations.africa/wp-content/uploads/2024/10/original.png';
        const updatedHtmlContent = indexHtmlContent.toString().replace(
            '</head>',
            `<meta name="csrf-token" content="${csrfToken}"></head>`
        ).replace(
            '{{logo}}',
            logo
        );
        reply
            .header("Content-Type", "text/html; charset=utf-8")
            .send(updatedHtmlContent);
    });
}