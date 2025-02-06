import { generateSignature } from "./generateSignature"


interface IVerifyOptions {
    token: string,
    secret: string
}


export function verify({ secret, token }: IVerifyOptions) {

    const [headerSent, payloadSent, signtureSent] = token.split(".")

    const signature = generateSignature({
        header: headerSent,
        payload: payloadSent,
        secret
    })
    console.log(signature === signtureSent)
    if (signature !== signtureSent) {
        throw new Error("Invalid JWT token")
    }

    const decodedPayload = JSON.parse(
        Buffer.from(payloadSent, 'base64url')
            .toString("utf-8"))
    if (decodedPayload.exp < Date.now()) {
        throw new Error("Expired Token")
    }
    return decodedPayload
}