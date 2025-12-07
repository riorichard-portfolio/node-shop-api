import { IAuthEventCommandRepository } from "../.domains/auth.domain/auth.event.domain";
import { ISessionToUpsert } from "../.domains/auth.domain/auth.event.domain";
import { TConsumerHandler } from "../.domains/.shared.domain/message.broker";

import EventHandler from "./.base.event.handler";

const sessionMessageSchema = {
    expiredAt: 'number',
    sessionId: 'uuid',
    userId: 'uuid'
} as const

export default class AuthEventHandler extends EventHandler {
    constructor(
        private readonly repository: IAuthEventCommandRepository
    ) {
        super()
    }

    public sessionCreated: TConsumerHandler = async (messages: string[]) => {
        const sessions: ISessionToUpsert[] = []
        const failedDetails: string[] = []
        messages.forEach(message => {
            const result = this.safelyGetMessageObject(message, sessionMessageSchema)
            if (result.isValidMessageData) {
                sessions.push(result.validatedMessageData())
            } else {
                failedDetails.push(`failedMessage: ${result.reason()} with message ${message}`)
            }
        })
        await this.repository.bulkUpsertSession(sessions)
        if (failedDetails.length > 0) {
            console.warn(`some sessionCreated event messages error to processed: ${failedDetails}`)
        }
    }
}