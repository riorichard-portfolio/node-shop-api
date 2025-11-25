export type ConsumerHandler = (messages: string[]) => Promise<void> | void

export interface MQProducer {
    publish<T>(messageValues: T[], topic: string, ack?: boolean): Promise<void>;
}

export interface MQConsumer {
    on(topic: string, handler: ConsumerHandler): this
    startConsumer(): Promise<void>
}