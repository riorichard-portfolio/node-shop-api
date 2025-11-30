export type TConsumerHandler = (messages: string[]) => Promise<void> | void

export interface IMQProducer {
    publish<T>(messageValues: T[], topic: string, ack?: boolean): Promise<void>;
}

export interface IMQConsumer {
    on(topic: string, handler: TConsumerHandler): this
    startConsumer(): Promise<void>
}