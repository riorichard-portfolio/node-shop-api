import { IAuthEventHandlerRepositories } from "../.domains/auth.domain/auth.event";
import { ISessionToInsert } from "../.domains/auth.domain/auth.event";
import { TConsumerHandler } from "../.domains/.shared.domain/message.broker";
import { ITransactionalRepositories } from "../.domains/.shared.domain/transactional.repositories";

import EventHandler from "./.base.event.handler";

const sessionMessageSchema = {
    expiredAt: 'number',
    sessionId: 'uuid',
    userId: 'uuid',
} as const



export default class AuthEventHandler extends EventHandler {
    constructor(
        private readonly transactionalRepositories: ITransactionalRepositories<IAuthEventHandlerRepositories>
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
            this.transactionalRepositories.transaction(async (transactionRepositories) => {
                const insertedSessions = await transactionRepositories
                    .authEventCommandRepository()
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