export type ConsumerHandler = (messages: string[]) => Promise<void> | void

export interface MQProducer {
    publish(messageValues: (string | number | boolean)[][], topic: string, ack?: boolean): Promise<void>;
}

export interface MQConsumer {
    on(topic: string, handler: ConsumerHandler): this
    startConsumer(): Promise<void>
}