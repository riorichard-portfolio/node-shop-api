import { IAuthEventPublisher, ISessionToInsert } from "../.domains/auth.domain/auth.event";
import { IAuthMQTopics } from "../.domains/.shared.domain/message.broker.topics";

import { IMQProducer } from "../.domains/.shared.domain/message.broker";

export default class AuthEventPublisher implements IAuthEventPublisher {
    private readonly producer: IMQProducer
    private readonly topics: IAuthMQTopics

    constructor(
        producer: IMQProducer,
        topics: IAuthMQTopics
    ) {
        this.producer = producer
        this.topics = topics
    }

    public async publishSessionCreated(data: ISessionToInsert): Promise<void> {
        await this.producer.publish(
            [data],
            this.topics.sessionCreatedTopic(),
            false
        )
    }
}