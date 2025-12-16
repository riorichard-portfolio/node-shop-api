export interface ISessionToCreate {
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
    publishSessionCreated(data: ISessionToCreate): Promise<void>
}

export interface IAuthEventCommandRepository {
    bulkUpsertSession(sessions: ISessionToCreate[]): Promise<IReturnedCreatedSession[]>
}