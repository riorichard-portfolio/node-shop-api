import { UserEventPublisher as UserPublisher, UserToCreate } from "../domains/user.domain/user.event.domain";
import { UserMQTopics } from "../domains/.shared.domain/message.broker.topics";

import { MQProducer } from "../domains/.shared.domain/message.broker";

export default class UserEventPublisher implements UserPublisher {
    private readonly producer: MQProducer
    private readonly topics: UserMQTopics

    constructor(
        producer: MQProducer,
        topics: UserMQTopics
    ) {
        this.producer = producer
        this.topics = topics
    }

    public async publishUserRegistered(data: UserToCreate): Promise<void> {
        await this.producer.publish(
            [data],
            this.topics.USER_REGISTERED
        )
    }
}