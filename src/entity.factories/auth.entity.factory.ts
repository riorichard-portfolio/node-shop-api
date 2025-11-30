import { ISessionEntity } from "../.domains/auth.domain/auth.entities";
import { IAuthEntitiesFactory } from "../.domains/auth.domain/auth.factories";

class Session implements ISessionEntity {
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

export default class AuthEntitiesFactory implements IAuthEntitiesFactory {
    public createSession(sessionId: string, userId: string, expiredAt: number): ISessionEntity {
        return new Session(sessionId, userId, expiredAt)
    }
}