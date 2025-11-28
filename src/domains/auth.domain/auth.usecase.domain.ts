import { TApplicationResults } from "../.shared.domain/types"

export type TLoginSuccess = {
    accessToken(): string,
    refreshToken(): string
}

export type TLoginFailed =
    | { type: 'INVALID_EMAIL', email: string }
    | { type: 'INVALID_PASSWORD' }

export type TRegisterFailed =
    | { type: 'EMAIL_EXIST', email: string }

export type TRefreshTokenSuccess = {
    newToken(): string
}

export type TRefreshTokenFailed =
    | { type: 'INVALID_SESSION', sessionId: string }
    | { type: 'EXPIRED_SESSION', expiredAt: number }

export interface ILoginData {
    email(): string
    password(): string
}

export interface IRegisterData {
    email(): string
    password(): string
    fullName(): string
}

export interface IRefreshTokenData {
    sessionId(): string
}

export interface IAuthUsecase {
    login(data: ILoginData): Promise<TApplicationResults<TLoginSuccess, TLoginFailed>>
    register(data: IRegisterData): Promise<TApplicationResults<void, TRegisterFailed>>
    refreshAccessToken(data: IRefreshTokenData): Promise<TApplicationResults<TRefreshTokenSuccess, TRefreshTokenFailed>>
}