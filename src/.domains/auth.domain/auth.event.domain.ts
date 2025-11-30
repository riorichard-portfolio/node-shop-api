export interface ISessionToUpsert {
    sessionId: string
    userId: string
    expiredAt: number
}

export interface IAuthEventPublisher {
    publishSessionCreated(data: ISessionToUpsert): Promise<void>
}

export interface IAuthEventCommandRepository {
    bulkUpsertSession(sessions: ISessionToUpsert[]): Promise<void>
}