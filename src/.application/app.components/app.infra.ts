import AppEnvConfig from "./app.env.config";

import Bcrypt from "../../infrastructure/bcrypt";
import QueryPostgre from '../../infrastructure/postgre/query.postgre'
import CommandPostgre from '../../infrastructure/postgre/command.postgre'
import KafkaMQ from "../../infrastructure/kafka";
import RedisCache from '../../infrastructure/redis/.redis'
import UserRateLimiter from '../../infrastructure/redis/user.rate.limiter'
import ApplicationResultFactory from '../../infrastructure/application.results.factory'
import RepositoryResultFactory from '../../infrastructure/repository.result.factory'
import AuthJwt from '../../infrastructure/jwt/auth.jwt'
import LocalUserRateLimiter from '../../infrastructure/local.memory/local.user.rate.limiter'

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

export default class AppInfrastructure {
    private hasInfrastructurePrepared = false

    private readonly bcryptInfra: Bcrypt
    private readonly applicationResultFactoryInfra: ApplicationResultFactory
    private readonly repositoryResultFactoryInfra: RepositoryResultFactory
    private readonly authJwtInfra: AuthJwt

    private queryPostgreInfra: QueryPostgre | null = null
    private commandPostgreInfra: CommandPostgre | null = null
    private kafkaInfra: KafkaMQ | null = null
    private redisInfra: RedisCache | null = null
    private userRateLimiterInfra: UserRateLimiter | null = null
    private localUserRateLimiterInfra: LocalUserRateLimiter

    constructor(
        private readonly appConfig: AppEnvConfig
    ) {
        this.applicationResultFactoryInfra = new ApplicationResultFactory()
        this.repositoryResultFactoryInfra = new RepositoryResultFactory()

        this.authJwtInfra = new AuthJwt(appConfig.authConfig())
        this.bcryptInfra = new Bcrypt(appConfig.bcryptConfig())
        this.localUserRateLimiterInfra = new LocalUserRateLimiter(appConfig.userRateLimiterConfig())
    }

    public applicationResultFactory() {
        return this.applicationResultFactoryInfra
    }

    public repositoryResultFactory() {
        return this.repositoryResultFactoryInfra
    }

    public authJwt() {
        return this.authJwtInfra
    }

    private verifyInfrastructurePreparation(): void {
        if (!this.hasInfrastructurePrepared) {
            throw new Error(infraNotPreparedError)
        }
    }

    private async preparePostgres(): Promise<void> {
        const newQueryPostgre = new QueryPostgre(this.appConfig.queryPostgreConfig())
        const newCommandPostgre = new CommandPostgre(this.appConfig.commandPostgreConfig())
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

    public async prepareInfrastructure(): Promise<void> {
        await Promise.all([
            this.preparePostgres(),
            this.prepareKafka(),
            this.prepareRedis(),
            this.prepareUserRateLimiter()
        ])
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
            this.userRateLimiterInfra.close(),
            this.localUserRateLimiterInfra.stop()
        ])
    }

    public bcrypt(): Bcrypt {
        return this.bcryptInfra
    }


    public commandPostgre(): CommandPostgre {
        this.verifyInfrastructurePreparation()
        if (this.commandPostgreInfra == null) {
            throw new Error(commandPostgreNotPreparedError)
        }
        return this.commandPostgreInfra
    }

    public queryPostgre(): QueryPostgre {
        this.verifyInfrastructurePreparation()
        if (this.queryPostgreInfra == null) {
            throw new Error(queryPostgreNotPreparedError)
        }
        return this.queryPostgreInfra
    }

    public kafka(): KafkaMQ {
        this.verifyInfrastructurePreparation()
        if (this.kafkaInfra == null) {
            throw new Error(kafkaNotPreparedError)
        }
        return this.kafkaInfra
    }

    public redis(): RedisCache {
        this.verifyInfrastructurePreparation()
        if (this.redisInfra == null) {
            throw new Error(redisNotPreparedError)
        }
        return this.redisInfra
    }

    public userRateLimiter(): UserRateLimiter {
        this.verifyInfrastructurePreparation()
        if (this.userRateLimiterInfra == null) {
            throw new Error(userRateLimiterNotPreparedError)
        }
        return this.userRateLimiterInfra
    }

    public localUserRateLimiter(): LocalUserRateLimiter {
        return this.localUserRateLimiterInfra
    }

    

}