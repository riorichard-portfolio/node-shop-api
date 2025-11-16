export interface MQProducer {
    publish<T>(message: T, topic: string, ack: number): Promise<void>;
}

export interface MQConsumer {
    on(topic: string, handler: (message: Buffer) => Promise<void> | void): void
    startConsumer(): Promise<void>
}