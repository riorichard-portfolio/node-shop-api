import jwt from 'jsonwebtoken'

import { JWTTokenGenerator, JWTTokenVerifier } from '../domains/.shared.domain/json.web.token'

const jwtExpiredAtString = "expiredAt"

export default class JWT implements JWTTokenGenerator, JWTTokenVerifier {
    private readonly secretKey: string
    private readonly expiredTimeSeconds: number

    constructor(
        secretKey: string,
        expiredTimeSeconds: number
    ) {
        this.secretKey = secretKey
        this.expiredTimeSeconds = expiredTimeSeconds
    }

    public generateJWT(payload: Record<string, string | number | boolean>): string {
        return jwt.sign(
            { ...payload, expiredAt: Date.now() + this.expiredTimeSeconds * 1000 }, // * 1000 ms
            this.secretKey
        )
    }

    public verifyJWT(token: string): Record<string, string | number | boolean> | null {
        try {
            const payload = jwt.verify(token, this.secretKey)
            if (typeof payload === 'object') {
                if (typeof payload[jwtExpiredAtString] === 'number') {
                    if (Date.now() < payload[jwtExpiredAtString]) {
                        return payload
                    }
                }
            }

        } catch (error) {
            console.error(`internal error happened at verify jwt: ${error}`)
        }
        return null
    }
}