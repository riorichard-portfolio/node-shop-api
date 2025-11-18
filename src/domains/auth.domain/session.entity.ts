import { randomUUID } from "crypto";

import { Entity } from "../../.core.internal.framework/internal.framework";

type SessionStringProps =
    | "userId"

type SessionNumberProps =
    | "expiredAt"

const entityName = 'sessionEntity'
const properties: [SessionStringProps | SessionNumberProps, 'string' | 'number'][] = [
    ['userId', 'string'],
    ['expiredAt', 'number']
]

export default class SessionEntity extends Entity<SessionStringProps, SessionNumberProps, never> {
    constructor() {
        super(entityName, properties)
    }
    public newSessionId(): this {
        const newUUID = randomUUID()
        return this.SET_PRIMARY_ID(newUUID)
    }
    public setSessionId(sessionId: string): this {
        return this.SET_PRIMARY_ID(sessionId)
    }
    public setUserId(userId: string): this {
        return this.SET_PROP_STRING('userId', userId)
    }
    public setExpiredAt(unixExpiredAt: number): this {
        return this.SET_PROP_NUMBER('expiredAt', unixExpiredAt)
    }
    public dto() {
        return this.GET_DTO()
    }
}