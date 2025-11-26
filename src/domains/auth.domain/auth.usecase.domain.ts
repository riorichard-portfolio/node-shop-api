import { UsecaseResult } from "../.shared.domain/types"

export type LoginSuccess = {
    accessToken(): string,
    refreshToken(): string
}

export type LoginFailed =
    | { type: 'INVALID_EMAIL', email: string }
    | { type: 'INVALID_PASSWORD' }

export type RegisterFailed =
    | { type: 'EMAIL_EXIST', email: string }

export type RefreshTokenSuccess = {
    newToken(): string
}

export type RefreshTokenFailed =
    | { type: 'INVALID_SESSION', sessionId: string }
    | { type: 'EXPIRED_SESSION', expiredAt: number }

export interface LoginData {
    email(): string
    password(): string
}

export interface RegisterData {
    email(): string
    password(): string
    fullName(): string
}

export interface RefreshTokenData {
    sessionId(): string
}

export interface AuthUsecase {
    login(data: LoginData): Promise<UsecaseResult<LoginSuccess, LoginFailed>>
    register(data: RegisterData): Promise<UsecaseResult<void, RegisterFailed>>
    refreshAccessToken(data: RefreshTokenData): Promise<UsecaseResult<RefreshTokenSuccess, RefreshTokenFailed>>
}