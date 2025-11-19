type MQTopics<T extends Record<string, string>> = T ;

export type AuthMQTopics = MQTopics<{
    SESSION_CREATED: string
}>