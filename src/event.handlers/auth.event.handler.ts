import { IAuthEventCommandRepository } from "../.domains/auth.domain/auth.event";
import { IAuthSyncDBOutboxCommandRepository } from '../.domains/auth.domain/auth.outbox.repository'
import { ISessionToInsert } from "../.domains/auth.domain/auth.event";
import { TConsumerHandler } from "../.domains/.shared.domain/message.broker";
import { ITransactionalRepositories } from '../.domains/.shared.domain/transactional.repositories'

import EventHandler from "./.base.event.handler";

const sessionMessageSchema = {
    expiredAt: 'number',
    sessionId: 'uuid',
    userId: 'uuid',
} as const

interface IAuthEventHandlerRepositories {
    authOutboxSyncDBCommandRepository(): IAuthSyncDBOutboxCommandRepository
    authCommandRepository(): IAuthEventCommandRepository
}


export default class AuthEventHandler extends EventHandler {
    constructor(
        private readonly repositories: ITransactionalRepositories<IAuthEventHandlerRepositories>
    ) {
        super()
    }

    public sessionCreated: TConsumerHandler = async (messages: string[]) => {
        const sessions: ISessionToInsert[] = []
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
            this.repositories.transaction(async (transactionRepositories: IAuthEventHandlerRepositories) => {
                const insertedSessions = await transactionRepositories
                    .authCommandRepository()
                    .bulkUpsertSession(sessions)
                if (insertedSessions.length > 0) {
                    await transactionRepositories
                        .authOutboxSyncDBCommandRepository()
                        .bulkInsertSessionToSync(insertedSessions)
                }
            })
        }
        if (failedDetails.length > 0) {
            console.warn(`some sessionCreated event messages error to processed: ${failedDetails}`)
        }
    }
}