import { IUserSyncDBOutboxCommandRepository } from './user.outbox.repository'

export interface IUserToInsert {
    userId: string
    email: string
    hashedPassword: string
    fullname: string
}

export interface IReturnedCreatedUser{
    userId: string
    email: string
    hashedPassword: string
    fullname: string
}

export interface IUserEventPublisher {
    publishUserRegistered(data: IUserToInsert): Promise<void>
}

export interface IUserEventCommandRepository {
    bulkInsertUser(users: IUserToInsert[]): Promise<IReturnedCreatedUser[]>
}

export interface IUserEventHandlerRepositories {
    userOutboxSyncDBCommandRepository(): IUserSyncDBOutboxCommandRepository
    userEventCommandRepository(): IUserEventCommandRepository
}
