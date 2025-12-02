import {
    IKafkaConfig,
    IAuthConfig,
    IBcryptConfig,
    IPostgreConfig,
    IRedisConfig
} from '../.domains/.shared.domain/config'

import {
    IAuthMQTopics,
    IUserMQTopics
} from '../.domains/.shared.domain/message.broker.topics'

import {
    IApplicationResultFactory
} from '../.domains/.shared.domain/result.factory'

import {
    IRepositoryResultFactory
} from '../.domains/.shared.domain/result.factory'

import {
    IAuthTokenCreator,
    IAuthTokenVerifier
} from '../.domains/auth.domain/auth.token.management'

import {
    IBcryptHasher,
    IBcryptVerifier
} from '../.domains/.shared.domain/bcrypt'

import {
    ISqlQueryDB,
    ISqlCommandDB
} from '../.domains/.shared.domain/sql.db'

import {
    IMQConsumer,
    IMQProducer
} from '../.domains/.shared.domain/message.broker'

import IMemoryCache from '../.domains/.shared.domain/memory.cache'

export interface IAppConfig {
    kafkaConfig(): IKafkaConfig
    postgreConfig(): IPostgreConfig
    redisConfig(): IRedisConfig
    bcryptConfig(): IBcryptConfig
    authMqTopics(): IAuthMQTopics
    userMqTopics(): IUserMQTopics
    authConfig(): IAuthConfig
}

export interface IAppInfra {
    appResultFactory(): IApplicationResultFactory
    repoResultFactory(): IRepositoryResultFactory
    authTokenCreator(): IAuthTokenCreator
    authTokenVerifier(): IAuthTokenVerifier
    bcryptHasher(): IBcryptHasher
    bcryptVerifier(): IBcryptVerifier
    queryPostgre(): ISqlQueryDB
    commandPostgre(): ISqlCommandDB
    kafkaProducer(): IMQProducer
    kafkaConsumer(): IMQConsumer
    redis(): IMemoryCache
}