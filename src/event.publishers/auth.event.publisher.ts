import { AuthEventPublisher as AuthPublisher, SessionToUpsert } from "../domains/auth.domain/auth.event.domain";
import { AuthMQTopics } from "../domains/.shared.domain/message.broker.topics";

import { MQProducer } from "../domains/.shared.domain/message.broker";

export default class AuthEventPublisher implements AuthPublisher {
    private readonly producer: MQProducer
    private readonly topics: AuthMQTopics

    constructor(
        producer: MQProducer,
        topics: AuthMQTopics
    ) {
        this.producer = producer
        this.topics = topics
    }

    public async publishSessionCreated(data: SessionToUpsert): Promise<void> {
        await this.producer.publish(
            [data],
            this.topics.SESSION_CREATED,
            false
        )
    }
}