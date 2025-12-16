export interface ISessionToUpsert {
    sessionId: string
    userId: string
    expiredAt: number
}

export interface IReturnedInsertedSession {
    sessionId: string
    userId: string
    expiredAt: number
}

export interface IAuthEventPublisher {
    publishSessionCreated(data: ISessionToUpsert): Promise<void>
}

export interface IAuthEventCommandRepository {
    bulkUpsertSession(sessions: ISessionToUpsert[]): Promise<IReturnedInsertedSession[]>
}

export interface ISessionToSync {
    sessionId: string
    userId?: string
    expiredAt?: number
}

export interface IAuthSyncDBOutboxCommandRepository {
    bulkInsertSessionToSync(syncData: ISessionToSync[]): Promise<void>
}