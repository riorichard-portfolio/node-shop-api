import {
    IKafkaConfig,
    IAuthConfig,
    IBcryptConfig,
    IPostgreConfig,
    IRedisConfig,
    IUserRateLimiterConfig
} from '../../.domains/.shared.domain/config'

import {
    IAuthMQTopics,
    IUserMQTopics
} from '../../.domains/.shared.domain/message.broker.topics'

import {
    IApplicationResultFactory
} from '../../.domains/.shared.domain/result.factory'

import {
    IRepositoryResultFactory
} from '../../.domains/.shared.domain/result.factory'

import {
    IAuthTokenCreator,
    IAuthTokenVerifier
} from '../../.domains/auth.domain/auth.token.management'

import {
    IBcryptHasher,
    IBcryptVerifier
} from '../../.domains/.shared.domain/bcrypt'

import {
    ISqlQueryDB,
    ISqlCommandDB
} from '../../.domains/.shared.domain/sql.db'

import {
    IMQConsumer,
    IMQProducer
} from '../../.domains/.shared.domain/message.broker'

import IMemoryCache from '../../.domains/.shared.domain/memory.cache'

import {
    IUserRateLimiter
} from '../../.domains/.shared.domain/rate.limiter'

import {
    IAuthUsecase
} from '../../.domains/auth.domain/auth.usecase.domain'

import {
    IAuthEventCommandRepository
} from '../../.domains/auth.domain/auth.event.domain'

import {
    IUserEventCommandRepository
} from '../../.domains/user.domain/user.event.domain'

export interface IAppConfig {
    kafkaConfig(): IKafkaConfig
    postgreConfig(): IPostgreConfig
    redisConfig(): IRedisConfig
    bcryptConfig(): IBcryptConfig
    authMqTopics(): IAuthMQTopics
    userMqTopics(): IUserMQTopics
    authConfig(): IAuthConfig
    userRateLimiterConfig(): IUserRateLimiterConfig
}

export interface IAppInfra {
    prepereInfrastructure(): Promise<void>

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
    userRateLimiter(): IUserRateLimiter
}

export interface IAppFeatures { // usecases
    authFeature(): IAuthUsecase
}

export interface IAppWorkerStorage { // command db repositories
    authWorkerStorage(): IAuthEventCommandRepository
    userWorkerStorage(): IUserEventCommandRepository
}

export interface IAppRateLimiters { // infra ratelimiters
    userRateLimiter(): IUserRateLimiter
}

export interface IAppContainer {
    features(): IAppFeatures
    workerStorage(): IAppWorkerStorage
    rateLimiters(): IAppRateLimiters
    workerConsumer(): IMQConsumer
}