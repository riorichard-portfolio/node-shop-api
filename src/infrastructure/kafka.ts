import { Kafka, Producer, Consumer } from "kafkajs";

import { IMQProducer, IMQConsumer } from '../.domains/.shared.domain/message.broker'
import { TKafkaConfig } from "../config/config.instances/kafka.config";

const errorAlreadyStarted = 'invalid start operation: kafka already started'
const errorNotStartedYet = 'invalid kafka operation: kafka not started yet'
const errorAlreadyStopped = 'invalid stop operation: kafka already stopped'

export default class KafkaMQ implements IMQProducer, IMQConsumer {
    private readonly brokerNodes: string[]
    private readonly kafkaInstance: Kafka
    private readonly producer: Producer;
    private readonly consumer: Consumer;
    private kafkaStarted: boolean = false
    private kafkaStopped: boolean = false
    private consumerHandlersMap: Record<string, (messages: string[]) => Promise<void> | void> = {}

    constructor(config: TKafkaConfig) {
        this.brokerNodes = [config.KAFKA_BROKER_NODE]
        const newKafka = new Kafka({
            brokers: [config.KAFKA_BROKER_NODE],
            clientId: config.KAFKA_CLIENT_ID
        })
        this.kafkaInstance = newKafka
        this.producer = newKafka.producer()
        this.consumer = newKafka.consumer({
            groupId: config.KAFKA_GROUP_ID
        })
    }

    private verifyStarted(): void {
        if (!this.kafkaStarted) throw new Error(errorNotStartedYet)
    }

    public async start(): Promise<void> {
        if (this.kafkaStarted) throw new Error(errorAlreadyStarted)
        await this.producer.connect();
        await this.consumer.connect();
        this.kafkaStarted = true;
        this.kafkaStopped = false;
    }

    public async isBrokerHealthy(): Promise<boolean> {
        try {
            this.verifyStarted()
            const admin = this.kafkaInstance.admin();
            const clusterInfo = await admin.describeCluster();
            await admin.disconnect()
            return clusterInfo.brokers.length > 0;

        } catch (error) {
            console.error('❌ Kafka broker health check failed:', error);
            return false;
        }
    }

    public async stop(): Promise<void> {
        this.verifyStarted()
        if (this.kafkaStopped) throw new Error(errorAlreadyStopped)
        await this.producer.disconnect();
        await this.consumer.disconnect();
        this.kafkaStarted = false;
        this.kafkaStopped = true
    }

    private calculateAcks(ack: boolean): number {
        if (!ack) return 0;                         // No acknowledgment
        if (this.brokerNodes.length > 1) return -1; // Wait for all replicas
        return 1;                                   // Wait for leader only
    }

    public async publish<T>(messageValues: T[], topic: string, ack: boolean = true): Promise<void> {
        this.verifyStarted()
        await this.producer.send({
            topic,
            messages: messageValues.map(msgVal => ({
                value: JSON.stringify(msgVal)
            })),
            acks: this.calculateAcks(ack)
        })
    }

    public on(topic: string, handler: (messages: string[]) => Promise<void> | void): this {
        this.verifyStarted()
        const foundHandler = this.consumerHandlersMap[topic]
        if (foundHandler !== undefined) {
            throw new Error(`invalid on operation: handler for topic ${topic} already set`)
        }
        this.consumerHandlersMap[topic] = handler
        return this
    }

    public async startConsumer(): Promise<void> {
        this.verifyStarted()
        await this.consumer.subscribe({
            topics: Object.keys(this.consumerHandlersMap),
            fromBeginning: false
        })
        await this.consumer.run({
            eachBatch: async ({ batch, commitOffsetsIfNecessary, heartbeat, resolveOffset }) => {
                const stringMessages: string[] = []
                for (const message of batch.messages) {
                    if (message.value === null) {
                        console.log('⚠️ Null message received, skipping...');
                        continue; // ✅ Skip null messages
                    }
                    stringMessages.push(message.value.toString())
                    resolveOffset(message.offset)
                }
                await heartbeat()
                const consumerHandler = this.consumerHandlersMap[batch.topic]
                if (consumerHandler === undefined) {
                    console.error('⚠️ Unknown unhandled topic, skipping entire batch...');
                    throw new Error('invalid consumer handler: aborting all kafka operation')
                } else {
                    await consumerHandler(stringMessages)
                    stringMessages.length = 0; // Reset array
                    await commitOffsetsIfNecessary()
                }
            }
        })
    }
}