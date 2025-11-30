import { IAuthEventPublisher, ISessionToUpsert } from "../.domains/auth.domain/auth.event.domain";
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

    public async publishSessionCreated(data: ISessionToUpsert): Promise<void> {
        await this.producer.publish(
            [data],
            this.topics.SESSION_CREATED,
            false
        )
    }
}