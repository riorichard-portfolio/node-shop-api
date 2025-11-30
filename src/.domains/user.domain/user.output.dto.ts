export interface IFindUserByEmailOutputDTO {
    email(): string
    userId(): string
    fullname(): string
    hashedPassword(): string
}

export type TFindUserByEmailFailedType = 'USER_NOT_EXISTS'
export type TCreateNewUserFailedType = 'EMAIL_EXISTS'