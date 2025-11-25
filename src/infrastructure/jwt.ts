import jwt from 'jsonwebtoken'

import {
    GeneratedToken,
    JWTTokenGenerator,
    JWTTokenVerifier,
    JWTVerifiedResult
} from '../domains/.shared.domain/json.web.token'

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

    public generateJWT(payload: Record<string, string | number | boolean>): GeneratedToken {
        const generatedToken = jwt.sign(
            { ...payload, expiredAt: Date.now() + this.expiredTimeSeconds * 1000 }, // * 1000 ms
            this.secretKey
        )
        return {
            value() {
                return generatedToken
            },
        }
    }

    public verifyJWT(token: string): JWTVerifiedResult {
        try {
            const payload = jwt.verify(token, this.secretKey)
            if (typeof payload === 'object') {
                if (typeof payload[jwtExpiredAtString] === 'number') {
                    if (Date.now() < payload[jwtExpiredAtString]) {
                        const { expiredAt, ...restPayload } = payload
                        return {
                            isExpired: false,
                            isInvalid: false,
                            payload() {
                                return restPayload
                            }
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