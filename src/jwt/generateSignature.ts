import { createHmac } from "node:crypto"


interface IGenerateSignatureOptions {
    header: string,
    payload: string,
    secret: string
}

export function generateSignature({ header, payload, secret }: IGenerateSignatureOptions) {

    const hmac = createHmac("sha256", secret)
    return hmac.update(`${header}.${payload}`).digest("base64url")
} 