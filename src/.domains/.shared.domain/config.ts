import { IAuthMQTopics, IUserMQTopics } from "./message.broker.topics"

export interface IKafkaConfig {
    brokerNodes(): string[]
    clientId(): string
    groupId(): string
}

export interface IPostgreConfig {
    host(): string
    username(): string
    password(): string
    databaseName(): string
    port(): number
    maxPool(): number
}

export interface IRedisConfig {
    host(): string
    port(): number
}

export interface IBcryptConfig {
    saltRounds(): number
}

export interface IAppConfig {
    kafkaConfig(): IKafkaConfig
    postgreConfig(): IPostgreConfig
    redisConfig(): IRedisConfig
    bcryptConfig(): IBcryptConfig
    authMqTopics(): IAuthMQTopics
    userMqTopics(): IUserMQTopics
}