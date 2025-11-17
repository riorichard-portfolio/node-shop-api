import { Config } from '../../.core.internal.framework/internal.framework'

type KafkaStringKeys =
    | "KAFKA_BROKER_NODE"
    | "KAFKA_CLIENT_ID"
    | "KAFKA_GROUP_ID"


const kafkaKeys: KafkaStringKeys[] = [
    "KAFKA_BROKER_NODE",
    "KAFKA_CLIENT_ID",
    "KAFKA_GROUP_ID"
]

export type TKafkaConfig = {
    [K in KafkaStringKeys]:
    K extends KafkaStringKeys ? string : never
}

export default class KafkaConfig extends Config<KafkaStringKeys, never, never> {
    constructor(kafkaCfgName: string) {
        super(kafkaCfgName, kafkaKeys)
    }

    public getAllVars(): TKafkaConfig {
        return {
            KAFKA_BROKER_NODE: this.GET_CONFIG_STRING("KAFKA_BROKER_NODE"),
            KAFKA_CLIENT_ID: this.GET_CONFIG_STRING("KAFKA_CLIENT_ID"),
            KAFKA_GROUP_ID: this.GET_CONFIG_STRING("KAFKA_GROUP_ID")
        }
    }
}