export interface MQProducer {
    publish(messageValues: (string | number | boolean)[][], topic: string, ack: boolean): Promise<void>;
}

export interface MQConsumer {
    on(topic: string, handler: (messages: string[]) => Promise<void> | void): this
    startConsumer(): Promise<void>
}