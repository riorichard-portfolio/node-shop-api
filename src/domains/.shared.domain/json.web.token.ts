type JWTPayload = Record<string, string | number | boolean>
export type JWTVerifiedResult =
    | {
        isExpired: true
        isInvalid: false
    }
    | {
        isExpired: false
        isInvalid: true
    }
    | {
        isExpired: false
        isInvalid: false
        payload(): JWTPayload
    }

export type GeneratedToken = {
    value(): string
}


export interface JWTTokenGenerator {
    generateJWT(payload: JWTPayload): GeneratedToken
}

export interface JWTTokenVerifier {
    verifyJWT(token: string): JWTVerifiedResult
}