export interface IAccessTokenPayload {
    userId(): string
}

export interface IVerifiedAccessTokenPayload extends IAccessTokenPayload {
    success: true
}

export type TAccessTokenFailedReasons = 'ACCESS_TOKEN_EXPIRED' | 'INVALID_ACCESS_TOKEN'

export interface IFailedAccessTokenVerifying {
    success: false
    reason(): TAccessTokenFailedReasons
}

export type TAccessTokenVerifyResult =
    | IVerifiedAccessTokenPayload
    | IFailedAccessTokenVerifying

export interface IRefreshTokenPayload {
    sessionId(): string
}

export interface IVerifiedRefreshTokenPayload extends IRefreshTokenPayload {
    success: true
}

export type TRefreshTokenFailedReasons = 'SESSION_EXPIRED' | 'INVALID_REFRESH_TOKEN'

export interface IFailedRefreshTokenVerifying {
    success: false
    reason(): TRefreshTokenFailedReasons
}

export type TRefreshTokenVerifyResult =
    | IVerifiedRefreshTokenPayload
    | IFailedRefreshTokenVerifying

export interface IAuthTokenCreator {
    createAccessToken(userId: string): string
    createRefreshToken(sessionId: string): string
}

export interface IAuthTokenVerifier {
    verifyAccessToken(accessToken: string): TAccessTokenVerifyResult
    verifyRefreshToken(refreshToken: string): TRefreshTokenVerifyResult
}
