import { IAppInfra, IAppConfig } from "../.application.architecture.ts";

import { IApplicationResultFactory, IRepositoryResultFactory } from "../../.domains/.shared.domain/result.factory.ts";
import { IAuthTokenCreator, IAuthTokenVerifier } from "../../.domains/auth.domain/auth.token.management.ts";
import { IBcryptHasher, IBcryptVerifier } from "../../.domains/.shared.domain/bcrypt.ts";
import { ISqlCommandDB, ISqlQueryDB } from "../../.domains/.shared.domain/sql.db.ts";
import { IMQConsumer, IMQProducer } from "../../.domains/.shared.domain/message.broker.ts";
import IMemoryCache from "../../.domains/.shared.domain/memory.cache.ts";
import { IUserRateLimiter } from "../../.domains/.shared.domain/rate.limiter.ts";

import ApplicationResultFactory from "../../infrastructure/application.results.factory.ts";
import AuthJwt from "../../infrastructure/jwt/auth.jwt.ts";
import Bcrypt from "../../infrastructure/bcrypt.ts";
import RepositoryResultFactory from "../../infrastructure/repository.result.factory.ts";
import QueryPostgre from '../../infrastructure/postgre/query.postgre.ts'
import CommandPostgre from '../../infrastructure/postgre/command.postgre.ts'
import KafkaMQ from "../../infrastructure/kafka.ts";
import RedisCache from '../../infrastructure/redis/.redis.ts'
import UserRateLimiter from '../../infrastructure/redis/user.rate.limiter.ts'

const notHealthyQueryPostgreError = 'prepare postgre error: query postgre is not healthy'
const notHealthyCommandPostgreError = 'prepare postgre error: command postgre is not healthy'
const notHealthyKafkaError = 'prepare kafka error: kafka is not healthy'
const notHealthyRedisError = 'prepare redis error: redis is not healthy'
const notHealthyUserRateLimiterError = 'prepare user rate limiter error: redis user rate limiter is not healthy'

const infraNotPreparedError = 'invalid infrastructure usage: infrastructure not prepared yet'
const queryPostgreNotPreparedError = 'invalid query postgre usage: query postgre is failed to prepared cannot be forced'
const commandPostgreNotPreparedError = 'invalid command postgre usage: command postgre is failed to prepared cannot be forced'
const kafkaNotPreparedError = 'invalid kafka usage: kafka is failed to prepared cannot be forced'
const redisNotPreparedError = 'invalid redis usage: redis is failed to prepared cannot be forced'
const userRateLimiterNotPreparedError = 'invalid user rate limiter usage: user rate limiter is failed to prepared cannot be forced'

export default class V1AppInfrastructure implements IAppInfra {
    private hasInfrastructurePrepared = false

    private readonly appResultFactoryInfra: IApplicationResultFactory
    private readonly repoResultFactoryInfra: IRepositoryResultFactory
    private readonly authJwtInfra: AuthJwt
    private readonly bcryptInfra: Bcrypt
    private queryPostgreInfra: QueryPostgre | null = null
    private commandPostgreInfra: CommandPostgre | null = null
    private kafkaInfra: KafkaMQ | null = null
    private redisInfra: RedisCache | null = null
    private userRateLimiterInfra: UserRateLimiter | null = null

    constructor(
        private readonly appConfig: IAppConfig
    ) {
        this.appResultFactoryInfra = new ApplicationResultFactory()
        this.repoResultFactoryInfra = new RepositoryResultFactory()
        this.authJwtInfra = new AuthJwt(appConfig.authConfig())
        this.bcryptInfra = new Bcrypt(appConfig.bcryptConfig())
    }

    private verifyInfrastructurePreparation(): void {
        if (!this.hasInfrastructurePrepared) {
            throw new Error(infraNotPreparedError)
        }
    }

    private async preparePostgres(): Promise<void> {
        const newQueryPostgre = new QueryPostgre(this.appConfig.postgreConfig())
        const newCommandPostgre = new CommandPostgre(this.appConfig.postgreConfig())
        const isQueryPostgreHealthy = await newQueryPostgre.isHealthy()
        const isCommandPostgreHealthy = await newCommandPostgre.isHealthy()
        if (!isQueryPostgreHealthy) {
            throw new Error(notHealthyQueryPostgreError)
        }
        if (!isCommandPostgreHealthy) {
            throw new Error(notHealthyCommandPostgreError)
        }
        this.queryPostgreInfra = newQueryPostgre
        this.commandPostgreInfra = newCommandPostgre
    }

    private async prepareKafka(): Promise<void> {
        const newKafka = new KafkaMQ(this.appConfig.kafkaConfig())
        await newKafka.start()
        const isKafkaHealthy = await newKafka.isBrokerHealthy()
        if (!isKafkaHealthy) {
            throw new Error(notHealthyKafkaError)
        }
        this.kafkaInfra = newKafka
    }

    private async prepareRedis(): Promise<void> {
        const newRedis = new RedisCache(this.appConfig.redisConfig())
        const isRedisHealthy = await newRedis.isHealthy()
        if (!isRedisHealthy) {
            throw new Error(notHealthyRedisError)
        }
        this.redisInfra = newRedis
    }

    private async prepareUserRateLimiter(): Promise<void> {
        const newUserRateLimiter = new UserRateLimiter(
            this.appConfig.redisConfig(),
            this.appConfig.userRateLimiterConfig()
        )
        const isUserRateLimiterHealthy = await newUserRateLimiter.isHealthy()
        if (!isUserRateLimiterHealthy) {
            throw new Error(notHealthyUserRateLimiterError)
        }
        this.userRateLimiterInfra = newUserRateLimiter
    }

    public async prepereInfrastructure(): Promise<void> {
        await this.preparePostgres()
        await this.prepareKafka()
        await this.prepareRedis()
        await this.prepareUserRateLimiter()
        this.hasInfrastructurePrepared = true
    }

    public async stopInfra(): Promise<void> {
        this.verifyInfrastructurePreparation()
        if (this.queryPostgreInfra == null) {
            throw new Error(queryPostgreNotPreparedError)
        }

        if (this.commandPostgreInfra == null) {
            throw new Error(commandPostgreNotPreparedError)
        }
        if (this.kafkaInfra == null) {
            throw new Error(kafkaNotPreparedError)
        }
        if (this.redisInfra == null) {
            throw new Error(redisNotPreparedError)
        }
        if (this.userRateLimiterInfra == null) {
            throw new Error(userRateLimiterNotPreparedError)
        }
        await Promise.all([
            this.queryPostgreInfra.close(),
            this.commandPostgreInfra.close(),
            this.kafkaInfra.stop(),
            this.redisInfra.close(),
            this.userRateLimiterInfra.close()
        ])
    }

    public appResultFactory(): IApplicationResultFactory {
        return this.appResultFactoryInfra
    }

    public authTokenCreator(): IAuthTokenCreator {
        return this.authJwtInfra
    }

    public authTokenVerifier(): IAuthTokenVerifier {
        return this.authJwtInfra
    }

    public bcryptHasher(): IBcryptHasher {
        return this.bcryptInfra
    }

    public bcryptVerifier(): IBcryptVerifier {
        return this.bcryptInfra
    }

    public repoResultFactory(): IRepositoryResultFactory {
        return this.repoResultFactoryInfra
    }

    public commandPostgre(): ISqlCommandDB {
        this.verifyInfrastructurePreparation()
        if (this.commandPostgreInfra == null) {
            throw new Error(commandPostgreNotPreparedError)
        }
        return this.commandPostgreInfra
    }

    public queryPostgre(): ISqlQueryDB {
        this.verifyInfrastructurePreparation()
        if (this.queryPostgreInfra == null) {
            throw new Error(queryPostgreNotPreparedError)
        }
        return this.queryPostgreInfra
    }

    public kafkaConsumer(): IMQConsumer {
        this.verifyInfrastructurePreparation()
        if (this.kafkaInfra == null) {
            throw new Error(kafkaNotPreparedError)
        }
        return this.kafkaInfra
    }

    public kafkaProducer(): IMQProducer {
        this.verifyInfrastructurePreparation()
        if (this.kafkaInfra == null) {
            throw new Error(kafkaNotPreparedError)
        }
        return this.kafkaInfra
    }

    public redis(): IMemoryCache {
        this.verifyInfrastructurePreparation()
        if (this.redisInfra == null) {
            throw new Error(redisNotPreparedError)
        }
        return this.redisInfra
    }

    public userRateLimiter(): IUserRateLimiter {
        this.verifyInfrastructurePreparation()
        if (this.userRateLimiterInfra == null) {
            throw new Error(userRateLimiterNotPreparedError)
        }
        return this.userRateLimiterInfra
    }

}