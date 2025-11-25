import { ServiceResult } from '../.shared.domain/types'

export type CreateNewUserOk = {
    userId(): string
}

export type CreateNewUserFailed =
    | { type: 'INVALID_EMAIL', email: string }
    | { type: 'EMAIL_EXIST', email: string }

export interface CreateNewUserData {
    email(): string
    password(): string
    fullName(): string
}


export interface UserService {
    createNewUser(data: CreateNewUserData): Promise<ServiceResult<CreateNewUserOk, CreateNewUserFailed>>
}