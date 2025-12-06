import { TConsumerHandler } from "../.domains/.shared.domain/message.broker";

import AuthEventCommandRepository from "../repositories/auth/auth.command.repository";

export default class AuthEventHandler {
    constructor(
        private readonly repository: AuthEventCommandRepository
    ) { }

    public sessionCreated: TConsumerHandler = (messages: string[]) => {
        try {
            this.repository.bulkUpsertSession()
        } catch (error) {
            console.error(`some error at session created : ${error}`)
        }
    }
}