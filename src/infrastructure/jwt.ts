import jwt from 'jsonwebtoken'

import {
    IJWTTokenGenerator,
    IJWTTokenVerifier,
    TJWTVerifiedResult
} from '../domains/.shared.domain/json.web.token'

const jwtExpiredAtString = "expiredAt"

export default class JWT implements IJWTTokenGenerator, IJWTTokenVerifier {
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
        const generatedToken = jwt.sign(
            { ...payload, expiredAt: Date.now() + this.expiredTimeSeconds * 1000 }, // * 1000 ms
            this.secretKey
        )
        return generatedToken
    }

    public verifyJWT(token: string): TJWTVerifiedResult {
        try {
            const payload = jwt.verify(token, this.secretKey)
            if (typeof payload === 'object') {
                if (typeof payload[jwtExpiredAtString] === 'number') {
                    if (Date.now() < payload[jwtExpiredAtString]) {
                        return {
                            isExpired: false,
                            isInvalid: false,
                            payload
                        }
                    } else {
                        return {
                            isExpired: true,
                            isInvalid: false
                        }
                    }
                }
            }
        } catch (_) { }
        return {
            isExpired: false,
            isInvalid: true
        }
    }
}