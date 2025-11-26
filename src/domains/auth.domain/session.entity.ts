export interface SessionEntity {
    sessionId(): string
    userId(): string
    expiredAt(): number
    isExpired(): boolean
}

export default class Session implements SessionEntity {
    constructor(
        private readonly sessionSessionId: string,
        private readonly sessionUserId: string,
        private readonly sessionExpiredAt: number
    ) { }
    public sessionId(): string { return this.sessionSessionId }
    public userId(): string { return this.sessionUserId }
    public expiredAt(): number { return this.sessionExpiredAt }
    public isExpired(): boolean { return Date.now() > this.sessionExpiredAt }
}