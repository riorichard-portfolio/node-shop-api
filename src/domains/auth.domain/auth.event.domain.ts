export type SessionTuple = [
    sessionId: string,
    userId: string,
    expiredAt: number
]

export interface AuthEventPublisher {
    publishSessionCreated(...data: SessionTuple): Promise<void>
}

export interface AuthEventCommandRepository {
    bulkInsertSession(sessions: SessionTuple[]): Promise<void>
}