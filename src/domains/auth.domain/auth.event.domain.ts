export interface SessionToUpsert {
    sessionId: string
    userId: string
    expiredAt: number
}

export interface AuthEventPublisher {
    publishSessionCreated(data: SessionToUpsert): Promise<void>
}

export interface AuthEventCommandRepository {
    bulkUpsertSession(sessions: SessionToUpsert[]): Promise<void>
}