import Config from './.base.config'
import { IAuthMQTopics } from '../.domains/.shared.domain/message.broker.topics'

export default class AuthMQTopics extends Config implements IAuthMQTopics {
    private readonly sessionCreatedTopicValue: string
    constructor(
        sessionCreatedTopic: unknown
    ) {
        super()
        this.sessionCreatedTopicValue = this.safelyGetString(sessionCreatedTopic)
    }

    public sessionCreatedTopic(): string {
        return this.sessionCreatedTopicValue
    }
}