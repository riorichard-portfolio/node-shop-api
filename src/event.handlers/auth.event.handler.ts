import { IAuthEventCommandRepository, IAuthSyncDBOutboxCommandRepository } from "../.domains/auth.domain/auth.event.domain";
import { ISessionToUpsert } from "../.domains/auth.domain/auth.event.domain";
import { TConsumerHandler } from "../.domains/.shared.domain/message.broker";
import { ITransactionalRepositories } from '../.domains/.shared.domain/transactional.repository'

import EventHandler from "./.base.event.handler";

const sessionMessageSchema = {
    expiredAt: 'number',
    sessionId: 'uuid',
    userId: 'uuid'
} as const

interface AuthEventHandlerRepositories {
    outboxSyncDBCommandRepository(): IAuthSyncDBOutboxCommandRepository
    authCommandRepository(): IAuthEventCommandRepository
}


export default class AuthEventHandler extends EventHandler {
    constructor(
        private readonly repositories: ITransactionalRepositories<AuthEventHandlerRepositories>
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
        if (sessions.length > 0) {
            this.repositories.transaction(async (transactionRepositories: AuthEventHandlerRepositories) => {
                const insertedSessions = await transactionRepositories
                    .authCommandRepository()
                    .bulkUpsertSession(sessions)
                if (insertedSessions.length > 0) {
                    await transactionRepositories
                        .outboxSyncDBCommandRepository()
                        .bulkInsertSessionToSync(insertedSessions)
                }
            })
        }
        if (failedDetails.length > 0) {
            console.warn(`some sessionCreated event messages error to processed: ${failedDetails}`)
        }
    }
}