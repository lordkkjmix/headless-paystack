import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import payStackOrangeScrapping from "../services/paystack_orange_scrapping_service";
import { PaymentProcessPayload, PaymentProviderKey } from "../types";
import payStackWaveScrapping from "../services/paystack_wave_scrapping_service";
import payStackMTNScrapping from "../services/paystack_mtn_scrapping_service";


export default async function apiController(fastify: FastifyInstance) {
    // PAYSTACK PAYMENT PROCESS HEADLESS FROM PAYMENT LINK
    fastify.post("/process", {
        schema: {
            body: {
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
                    otp: {
                        type: "string",
                        description: "OTP",
                        nullable: true
                    },
                    provider: {
                        type: "string",
                        description: "Provider"
                    },
                },
            }
        },
    }, async function (
        _request: FastifyRequest,
        reply: FastifyReply
    ) {
        const { paymentLink, phoneNumber, otp, provider } = _request.body as PaymentProcessPayload;
        if (paymentLink && paymentLink.startsWith("https://checkout.paystack.com/")) {
            try {
                if (provider === PaymentProviderKey.ORANGE_CI) {
                    const res = await payStackOrangeScrapping(paymentLink, phoneNumber,/*  provider, */ otp);
                    reply.send(res);
                } else if (provider === PaymentProviderKey.WAVE) {
                    const res = await payStackWaveScrapping(paymentLink, /* phoneNumber, provider */);
                    reply.send(res);
                } else if (provider === PaymentProviderKey.MTN) {
                    const res = await payStackMTNScrapping(paymentLink, phoneNumber, /* provider */);
                    reply.send(res);
                }
            } catch (error) {
                reply.send(error);
            }

        }
    });
    fastify.get("/payment-providers", async function (
        _request: FastifyRequest,
        reply: FastifyReply
    ) {
        const providers = [
            {
                key: PaymentProviderKey.ORANGE_CI,
                logo: "https://ompay.orange.ci/e-commerce/assets/img/orange_money_logo_grand.png",
                instructions: 'Taper <a href="tel:#144*82#" target="_blank" class="text-blue-500">#144*82#</a> ou utilisez l\'application Orange Money pour générer un code de paiement.',
                useHeadless: true,
                name: "Orange Money",
                fields: [
                    {
                        key: "phoneNumber",
                        label: "Numéro de téléphone",
                        type: "text",
                        placeholder: "0700000000",
                        required: true,
                    },
                    {
                        key: "otp",
                        label: "Code de paiement",
                        type: "text",
                        placeholder: "Entrez le code de paiement ici",
                        required: true,
                    },
                ],
            },
            {
                key: PaymentProviderKey.WAVE,
                logo: "https://www.wave.com/img/nav-logo.png",
                instructions: "Vous serez redirigé vers le QR CODE Wave pour effectuer votre paiement.",
                useHeadless: true,
                name: "Wave",
                fields: [
                    {
                        key: "phoneNumber",
                        label: "Numéro de téléphone",
                        type: "text",
                        placeholder: "0700000000",
                        required: true,
                    }
                ]
            },
            {
                key: PaymentProviderKey.MTN,
                logo: "https://momo.mtn.com/wp-content/uploads/sites/15/2022/07/Group-360.png?w=360",
                instructions: '<p>Vous serez redirigé vers l\'App MTN MoMo et recevrez une demande de paiement par SMS</p>',
                useHeadless: false,
                name: "MTN Money (Momo)",
                fields: [
                    {
                        key: "phoneNumber",
                        label: "Numéro de téléphone",
                        type: "text",
                        placeholder: "0700000000",
                        required: true,
                    }
                ]
            },
            {
                key: PaymentProviderKey.CARD,
                logo: "https://cdn-icons-png.flaticon.com/128/8983/8983163.png",
                instructions: "Vous serez rédiriger vers une page de paiement par carte, suivez les instructions pour finaliser votre transaction.",
                useHeadless: false,
                name: "Carte",
            }


        ]
        reply.send(providers);
    });
}


