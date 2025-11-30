export interface ISessionEntity {
    sessionId(): string
    userId(): string
    expiredAt(): number
    isExpired(): boolean
}