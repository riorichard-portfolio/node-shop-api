export interface ICreateNewUserInputDTO {
    email(): string
    password(): string
    fullname(): string
}

export interface IFindUserByEmailInputDTO {
    email(): string
}

export interface IEventRegisteredUserInputDTO {
    userId(): string
    email(): string
    hashedPassword(): string
    fullname(): string
}