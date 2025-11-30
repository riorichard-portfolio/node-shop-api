export interface ILoginInputDTO {
    email(): string
    password(): string
}

export interface IRegisterInputDTO {
    email(): string
    password(): string
    fullname(): string
}

export interface IRefreshTokenInputDTO {
    sessionId(): string
}