import { IUserEventPublisher, IUserToInsert } from "../.domains/user.domain/user.event";
import { IUserMQTopics } from "../.domains/.shared.domain/message.broker.topics";

import { IMQProducer } from "../.domains/.shared.domain/message.broker";

export default class UserEventPublisher implements IUserEventPublisher {
    private readonly producer: IMQProducer
    private readonly topics: IUserMQTopics

    constructor(
        producer: IMQProducer,
        topics: IUserMQTopics
    ) {
        this.producer = producer
        this.topics = topics
    }

    public async publishUserRegistered(data: IUserToInsert): Promise<void> {
        await this.producer.publish(
            [data],
            this.topics.userRegisteredTopic()
        )
    }
}