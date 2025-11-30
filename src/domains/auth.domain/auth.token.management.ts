export interface IVerifiedAccessTokenPayload {
    userId(): string
}

export interface IVerifiedRefreshTokenPayload {
    sessionId(): string
}

export interface IAuthTokenCreator {
    createAccessToken(userId: string): string
    createRefreshToken(sessionId: string): string
}

export interface IAuthTokenVerifier {
    verifyAccessToken(accessToken: string): IVerifiedAccessTokenPayload
    verifyRefreshToken(refreshToken: string): IVerifiedRefreshTokenPayload
}
