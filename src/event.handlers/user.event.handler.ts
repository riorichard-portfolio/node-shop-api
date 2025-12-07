import { IUserEventCommandRepository } from "../.domains/user.domain/user.event.domain";
import { IUserToCreate } from "../.domains/user.domain/user.event.domain";
import { TConsumerHandler } from "../.domains/.shared.domain/message.broker";

import EventHandler from "./.base.event.handler";

const userMessageSchema = {
    userId: 'uuid',
    email: 'string',
    hashedPassword: 'string',
    fullname: 'string'
} as const

export default class UserEventHandler extends EventHandler {
    constructor(
        private readonly repository: IUserEventCommandRepository
    ) {
        super()
    }

    public userRegistered: TConsumerHandler = async (messages: string[]) => {
        const users: IUserToCreate[] = []
        const failedDetails: string[] = []
        messages.forEach(message => {
            const result = this.safelyGetMessageObject(message, userMessageSchema)
            if (result.isValidMessageData) {
                users.push(result.validatedMessageData())
            } else {
                failedDetails.push(`failedMessage: ${result.reason()} with message ${message}`)
            }
        })
        await this.repository.bulkInsertUser(users)
        if (failedDetails.length > 0) {
            console.warn(`some userRegistered event messages error to processed: ${failedDetails}`)
        }
    }
}

