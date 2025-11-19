type JWTPayload = Record<string, string | number | boolean>

export interface JWTTokenGenerator {
    generateJWT(payload: JWTPayload): string
}

export interface JWTTokenVerifier {
    verifyJWT(token: string): JWTPayload | null
}