import { sign } from "./jwt/sign"
import { verify } from "./jwt/verify"


const secret = "my-secret"

const token = sign({
    exp: Date.now() + 24 * 60 * 60 * 1000,
    data: { sub: "@joaogabriel1995" },
    secret: secret
})

const decoded = verify({
    token,
    secret,
})


console.log(decoded)
