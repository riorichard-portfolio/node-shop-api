import { ServiceResult } from '../.shared.domain/types'

export type CreateNewUserOk = {
    userId(): string
}

export type CreateNewUserFailed =
    | { type: 'EMAIL_EXIST', email: string }

export interface CreateNewUserData {
    email(): string
    password(): string
    fullname(): string
}

export interface FindUserByEmailData {
    email(): string
}

export type FindUserByEmailOk = {
    email(): string
    userId(): string
    fullname(): string
    hashedPassword(): string
}

export type FindUserByEmailFailed =
    | { type: 'USER_NOT_EXIST', email: string }

export interface UserService {
    createNewUser(data: CreateNewUserData): Promise<ServiceResult<CreateNewUserOk, CreateNewUserFailed>>
    findUserByEmail(data: FindUserByEmailData): Promise<ServiceResult<FindUserByEmailOk, FindUserByEmailFailed>>
}