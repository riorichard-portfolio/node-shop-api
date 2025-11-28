type TJWTPayload = Record<string, string | number | boolean>
export type TJWTVerifiedResult =
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
        payload: TJWTPayload
    }



export interface IJWTTokenGenerator {
    generateJWT(payload: TJWTPayload): string
}

export interface IJWTTokenVerifier {
    verifyJWT(token: string): TJWTVerifiedResult
}