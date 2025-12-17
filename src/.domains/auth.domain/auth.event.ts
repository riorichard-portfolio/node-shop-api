import { IAuthSyncDBOutboxCommandRepository } from './auth.outbox.repository'

export interface ISessionToInsert {
    sessionId: string
    userId: string
    expiredAt: number
}

export interface IReturnedCreatedSession {
    sessionId: string
    userId: string
    expiredAt: number
}

export interface IAuthEventPublisher {
    publishSessionCreated(data: ISessionToInsert): Promise<void>
}

export interface IAuthEventCommandRepository {
    bulkUpsertSession(sessions: ISessionToInsert[]): Promise<IReturnedCreatedSession[]>
}

export interface IAuthEventHandlerRepositories {
    authOutboxSyncDBCommandRepository(): IAuthSyncDBOutboxCommandRepository
    authEventCommandRepository(): IAuthEventCommandRepository
}