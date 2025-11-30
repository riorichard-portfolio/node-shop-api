export interface ILoginOutputDTO {
    accessToken(): string,
    refreshToken(): string
}

export interface IRefreshTokenOutputDTO {
    newAccessToken(): string
}

export type TLoginFailedType = 'INVALID_EMAIL' | 'INVALID_PASSWORD'
export type TRegisterFailedType = 'EMAIL_EXISTS'
export type TRefreshTokenFailedType = 'INVALID_SESSION' | 'EXPIRED_SESSION'
