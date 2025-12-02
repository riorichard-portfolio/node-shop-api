import Config from './.base.config'
import { IUserMQTopics } from '../.domains/.shared.domain/message.broker.topics'

export default class UserMQTopics extends Config implements IUserMQTopics {
    private readonly userRegisteredTopicValue: string
    constructor(
        userRegisteredTopic: unknown
    ) {
        super()
        this.userRegisteredTopicValue = this.safelyGetString(userRegisteredTopic)
    }

    public userRegisteredTopic(): string {
        return this.userRegisteredTopicValue
    }
}