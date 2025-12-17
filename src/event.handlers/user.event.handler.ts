import { IUserEventHandlerRepositories } from "../.domains/user.domain/user.event";
import { IUserToInsert } from "../.domains/user.domain/user.event";
import { TConsumerHandler } from "../.domains/.shared.domain/message.broker";
import { ITransactionalRepositories } from '../.domains/.shared.domain/transactional.repositories'

import EventHandler from "./.base.event.handler";

const userMessageSchema = {
    userId: 'uuid',
    email: 'string',
    hashedPassword: 'string',
    fullname: 'string'
} as const

export default class UserEventHandler extends EventHandler {
    constructor(
        private readonly repositories: ITransactionalRepositories<IUserEventHandlerRepositories>
    ) {
        super()
    }

    public userRegistered: TConsumerHandler = async (messages: string[]) => {
        const users: IUserToInsert[] = []
        const failedDetails: string[] = []
        messages.forEach(message => {
            const result = this.safelyGetMessageObject(message, userMessageSchema)
            if (result.isValidMessageData) {
                users.push(result.validatedMessageData())
            } else {
                failedDetails.push(`failedMessage: ${result.reason()} with message ${message}`)
            }
        })
        if (users.length > 0) {
            this.repositories.transaction(async (transactionRepositories) => {
                const insertedUsers = await transactionRepositories
                    .userEventCommandRepository()
                    .bulkInsertUser(users)
                if (insertedUsers.length > 0) {
                    await transactionRepositories
                        .userOutboxSyncDBCommandRepository()
                        .bulkInsertUserToSync(insertedUsers)
                }
            })
        }
        if (failedDetails.length > 0) {
            console.warn(`some userRegistered event messages error to processed: ${failedDetails}`)
        }
    }
}

