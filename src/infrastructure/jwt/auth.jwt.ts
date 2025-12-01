import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

import {
    IAuthTokenCreator,
    IAuthTokenVerifier,
    IFailedAccessTokenVerifying,
    IFailedRefreshTokenVerifying,
    IVerifiedAccessTokenPayload,
    IVerifiedRefreshTokenPayload,
    TAccessTokenFailedReasons,
    TAccessTokenVerifyResult,
    TRefreshTokenFailedReasons,
    TRefreshTokenVerifyResult
} from "../../.domains/auth.domain/auth.token.management"
import { IAuthConfig } from '../../.domains/.shared.domain/config'

class FailedAccessTokenVerifying implements IFailedAccessTokenVerifying {
    public readonly success = false
    constructor(
        private readonly reasonValue: TAccessTokenFailedReasons
    ) { }
    public reason(): TAccessTokenFailedReasons {
        return this.reasonValue
    }
}

class FailedRefreshTokenVerifying implements IFailedRefreshTokenVerifying {
    public readonly success = false
    constructor(
        private readonly reasonValue: TRefreshTokenFailedReasons
    ) { }
    public reason(): TRefreshTokenFailedReasons {
        return this.reasonValue
    }
}

class VerifiedAccessTokenPayload implements IVerifiedAccessTokenPayload {
    private readonly userIdValue: string
    public readonly success = true

    constructor(
        userId: string
    ) {
        this.userIdValue = userId
    }

    public userId(): string {
        return this.userIdValue
    }
}

class VerifiedRefreshTokenPayload implements IVerifiedRefreshTokenPayload {
    private readonly sessionIdValue: string
    public readonly success = true

    constructor(
        sessionId: string
    ) {
        this.sessionIdValue = sessionId
    }

    public sessionId(): string {
        return this.sessionIdValue
    }
}


export default class AuthJwt implements IAuthTokenCreator, IAuthTokenVerifier {
    private readonly msPerDay = 24 * 60 * 60 * 1000;
    private readonly msPerMins = 60 * 1000

    private readonly accessTokenPrivateKey: string
    private readonly accessTokenPublicKey: string
    private readonly refreshTokenPrivateKey: string
    private readonly refreshTokenPublicKey: string

    constructor(
        private readonly authConfig: IAuthConfig
    ) {
        this.accessTokenPrivateKey = fs.readFileSync(
            path.join(process.cwd(), 'jwt_keys/access_token_jwt_private_key.pem'),
            'utf8'
        )
        this.accessTokenPublicKey = fs.readFileSync(
            path.join(process.cwd(), 'jwt_keys/access_token_jwt_public_key.pem'),
            'utf8'
        )
        this.refreshTokenPrivateKey = fs.readFileSync(
            path.join(process.cwd(), 'jwt_keys/refresh_token_jwt_private_key.pem'),
            'utf8'
        )
        this.refreshTokenPublicKey = fs.readFileSync(
            path.join(process.cwd(), 'jwt_keys/refresh_token_jwt_public_key.pem'),
            'utf8'
        )
    }

    private generateAccessTokenExpiredAt(): number {
        return Date.now() + (this.authConfig.accessTokenExpiredMins() * this.msPerMins)
    }

    private generateRefreshTokenExpiredAt(): number {
        return Date.now() + (this.authConfig.sessionExpiredDays() * this.msPerDay)
    }

    public createAccessToken(userId: string): string {
        return jwt.sign(
            { userId, expiredAt: this.generateAccessTokenExpiredAt() },
            this.accessTokenPrivateKey,
            { algorithm: 'RS256' }
        )
    }

    public verifyAccessToken(accessToken: string): TAccessTokenVerifyResult {
        try {
            const decodedPayload = jwt.verify(
                accessToken,
                this.accessTokenPublicKey,
                { algorithms: ['RS256'] }
            )
            if (typeof decodedPayload == 'object' && decodedPayload != null) {
                if (typeof decodedPayload['userId'] != 'string' ||
                    typeof decodedPayload['expiredAt'] != 'number'
                ) {
                    throw new Error('verify access token error: invalid payload object keys userId & expiredAt must sent')
                } else {
                    if (Date.now() > decodedPayload['expiredAt']) {
                        return new FailedAccessTokenVerifying('ACCESS_TOKEN_EXPIRED')
                    }
                    return new VerifiedAccessTokenPayload(decodedPayload['userId'])
                }
            } else {
                throw new Error('verify access token error: invalid payload object')
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'JsonWebTokenError') {
                    return new FailedAccessTokenVerifying('INVALID_ACCESS_TOKEN')
                } else {
                    throw new Error(`verify access token error: ${error}`)

                }
            }
            throw new Error(`unknown verify access token error: ${error}`)
        }
    }

    public createRefreshToken(sessionId: string): string {
        return jwt.sign(
            { sessionId, expiredAt: this.generateRefreshTokenExpiredAt() },
            this.refreshTokenPrivateKey,
            { algorithm: 'RS256' }
        )
    }

    public verifyRefreshToken(refreshToken: string): TRefreshTokenVerifyResult {
        try {
            const decodedPayload = jwt.verify(
                refreshToken,
                this.refreshTokenPublicKey,
                { algorithms: ['RS256'] }
            )
            if (typeof decodedPayload == 'object' && decodedPayload != null) {
                if (typeof decodedPayload['sessionId'] != 'string' ||
                    typeof decodedPayload['expiredAt'] != 'number'
                ) {
                    throw new Error('verify refresh token error: invalid payload object keys sessionId & expiredAt must sent')
                } else {
                    if (Date.now() > decodedPayload['expiredAt']) {
                        return new FailedRefreshTokenVerifying('SESSION_EXPIRED')
                    }
                    return new VerifiedRefreshTokenPayload(decodedPayload['sessionId'])
                }
            } else {
                throw new Error('verify refresh token error: invalid payload object')
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'JsonWebTokenError') {
                    return new FailedRefreshTokenVerifying('INVALID_REFRESH_TOKEN')
                } else {
                    throw new Error(`verify refresh token error: ${error}`)

                }
            }
            throw new Error(`unknown verify refresh token error: ${error}`)
        }
    }
}
