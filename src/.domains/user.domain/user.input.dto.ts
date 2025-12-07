export interface ICreateNewUserInputDTO {
    email(): string
    password(): string
    fullname(): string
}

export interface IFindUserByEmailInputDTO {
    email(): string
}