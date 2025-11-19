import { AuthEventPublisher as AuthPublisher } from "../domains/auth.domain/auth.event.domain";
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

    public async publishSessionCreated(sessionId: string, userId: string, expiredAt: number): Promise<void> {
        await this.producer.publish(
            [[sessionId, userId, expiredAt]],
            this.topics.SESSION_CREATED,
            false
        )
    }
}