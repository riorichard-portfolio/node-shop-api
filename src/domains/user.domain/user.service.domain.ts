import { TApplicationResults } from '../.shared.domain/types'

export type TCreateNewUserOk = {
    userId(): string
}

export type TCreateNewUserFailed =
    | { type: 'EMAIL_EXIST', email: string }

export interface ICreateNewUserData {
    email(): string
    password(): string
    fullname(): string
}

export interface IFindUserByEmailData {
    email(): string
}

export type TFindUserByEmailOk = {
    email(): string
    userId(): string
    fullname(): string
    hashedPassword(): string
}

export type TFindUserByEmailFailed =
    | { type: 'USER_NOT_EXIST', email: string }

export interface IUserService {
    createNewUser(data: ICreateNewUserData): Promise<TApplicationResults<TCreateNewUserOk, TCreateNewUserFailed>>
    findUserByEmail(data: IFindUserByEmailData): Promise<TApplicationResults<TFindUserByEmailOk, TFindUserByEmailFailed>>
}