export enum PaymentProviderKey {
    ORANGE_CI = "ORANGE_CI",
    MTN = "MTN_CI",
    WAVE = "WAVE_CI",
    CARD = "CARD",
}
export interface PaymentProcessPayload {
    paymentLink?: string;
    phoneNumber: string;
    otp: string;
    provider: PaymentProviderKey;
}
export interface PaymentInitPayload {
    email: string;
    phone: string;
    amount: string;
    currency: string;
    callback_url: string;
    channels: string[];
    metadata?: string;
    reference?: string;
    last_name: string;
    first_name: string;
}
export interface PaystackPaymentResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}
export type ProcessParams = {
    paymentLink: string;
    phoneNumber: string;
}
export interface PaymentProvider {
    key: PaymentProviderKey;
    logo: string;
    name: string;
    instructions: string;
    useHeadless: boolean;
    fields?: PaymentProviderField[];
}
export interface PaymentProviderField {
    key: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
}
export interface PayStackPaymentResponse {
    event: PayStackWebhookPayloadEvent;
    data: {
        id: number;
        domain: string;
        amount: number;
        currency: string;
        due_date?: string;
        has_invoice: boolean;
        invoice_number?: string;
        description: string;
        pdf_url?: string;
        line_items: [];
        tax?: [];
        request_code: string;
        status: PayStackPaymentStatus;
        paid: boolean;
        paid_at: string;
        metadata?: string;
        notifications?: [
            {
                sent_at: string;
                channel: string;
            }
        ],
        offline_reference: string;
        customer: number;
        created_at: string;
    }
}
export enum PayStackWebhookPayloadEvent {
    paymentSucceeded = 'paymentrequest.success',
    paymentFailed = 'paymentrequest.failed',
    paymentPending = 'paymentrequest.pending',
    refundFailed = 'refund.failed',
    refundPending = 'refund.pending',
    refundProcessed = 'refund.processed',
    refundProcessing = 'refund.processing',
    transferFailed = 'transfer.failed',
    transferSuccess = 'transfer.success',
    transferReversed = 'transfer.reversed',
    chargeSuccess = 'charge.success',
    chargeFailed = 'charge.failed',
}
export enum PayStackPaymentStatus {
    success = 'success',
    failed = 'failed',
    pending = 'pending',
    abandoned = 'abandoned',
}