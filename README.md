# JWT Authentication in TypeScript

Este projeto implementa a criação e verificação de JSON Web Tokens (JWT) utilizando TypeScript e Node.js.

## 🚀 Tecnologias Utilizadas
- **Node.js**
- **TypeScript**
- **Crypto (módulo nativo do Node.js)**

## 📌 Funcionalidades
- **Gerar assinaturas HMAC SHA-256**
- **Criar tokens JWT**
- **Verificar e validar tokens JWT**

---

## 📂 Estrutura do Projeto

```
📁 projeto-jwt
├── 📂 jwt
│   ├── generateSignature.ts  # Gera a assinatura do JWT
│   ├── sign.ts               # Cria um token JWT
│   ├── verify.ts             # Verifica a validade do JWT
├── index.ts                  # Testa geração e verificação do JWT
└── README.md                 # Documentação do projeto
```

---

## 🛠️ Instalação e Uso

### 🔹 1. Clonar o repositório
```sh
git clone https://github.com/joaogabriel1995/JWTStudy.git
cd JWTStudy
```

### 🔹 2. Instalar dependências
```sh
npm install
```

### 🔹 3. Rodar o projeto
```sh
npm run dev
```

---

## 📝 Código Explicado

### 🔹 Gerando a Assinatura (`generateSignature.ts`)
A função `generateSignature` utiliza o módulo `crypto` para criar um hash HMAC SHA-256 com base no cabeçalho e no payload do token.

```ts
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
```

### 🔹 Criando um Token JWT (`sign.ts`)
A função `sign` cria um token JWT com um cabeçalho, payload e assinatura.

```ts
import { generateSignature } from "./generateSignature"

interface ISignOptions {
    exp: number
    data: Record<string, any>
    secret: string
}

export function sign({ data, exp, secret }: ISignOptions): string {
    const header = { alg: 'HS256', typ: "JWT" }
    const payload = { ...data, iat: Date.now(), exp: exp }
    
    const base64EncodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url")
    const base64EncodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
    
    const signature = generateSignature({ header: base64EncodedHeader, payload: base64EncodedPayload, secret })

    return `${base64EncodedHeader}.${base64EncodedPayload}.${signature}`
}
```

### 🔹 Verificando um Token JWT (`verify.ts`)
A função `verify` verifica se um token JWT é válido e não expirou.

```ts
import { generateSignature } from "./generateSignature"

interface IVerifyOptions {
    token: string,
    secret: string
}

export function verify({ secret, token }: IVerifyOptions) {
    const [headerSent, payloadSent, signatureSent] = token.split(".")
    
    const signature = generateSignature({ header: headerSent, payload: payloadSent, secret })
    
    if (signature !== signatureSent) {
        throw new Error("Invalid JWT token")
    }
    
    const decodedPayload = JSON.parse(Buffer.from(payloadSent, 'base64url').toString("utf-8"))
    
    if (decodedPayload.exp < Date.now()) {
        throw new Error("Expired Token")
    }
    return decodedPayload
}
```

### 🔹 Testando o JWT (`index.ts`)
O código abaixo cria um token JWT e depois verifica sua validade.

```ts
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
```

---

## 🔐 Segurança
- **O segredo deve ser mantido seguro**, idealmente usando variáveis de ambiente (`process.env.SECRET`).
- **Expiração curta para os tokens** reduz riscos de uso indevido.

---
