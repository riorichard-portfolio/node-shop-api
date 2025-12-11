import BcryptConfig from "../../config/bcrypt.config";
import KafkaConfig from "../../config/kafka.config";
import PostgreConfig from "../../config/postgre.config";
import RedisConfig from "../../config/redis.config";
import AuthMQTopics from "../../config/auth.mq.topics";
import UserMQTopics from "../../config/user.mq.topics";
import AuthConfig from '../../config/auth.config';
import UserRateLimiterConfig from '../../config/user.rate.limiter.config';
import RestAppConfig from '../../config/rest.app.config'

type NodeEnv = 'local' | 'development' | 'staging' | 'production'

export default class AppEnvConfig {
    private readonly nodeEnv: NodeEnv

    private readonly kafkaConfigValue: KafkaConfig
    private readonly commandPostgreConfigValue: PostgreConfig
    private readonly queryPostgreConfigValue: PostgreConfig
    private readonly redisConfigValue: RedisConfig
    private readonly bcryptConfigValue: BcryptConfig
    private readonly authMQTopicsValue: AuthMQTopics
    private readonly userMQTopicsValue: UserMQTopics
    private readonly authConfigValue: AuthConfig
    private readonly userRateLimiterConfigValue: UserRateLimiterConfig
    private readonly restAppConfigValue: RestAppConfig

    constructor(nodeEnv: string = 'local') {
        if (nodeEnv != 'local' && nodeEnv != 'development' && nodeEnv != 'staging' && nodeEnv != 'production') {
            throw new Error('node env must either local | development | staging | production')
        }
        this.nodeEnv = nodeEnv
        if (this.nodeEnv == 'local') {
            require('dotenv').config({ path: '.env.local' })
        }
        this.kafkaConfigValue = new KafkaConfig(
            [this.safelyGetString('kafka.broker.node')],
            this.safelyGetString('kafka.clientid'),
            this.safelyGetString('kafka.groupid')
        )
        this.commandPostgreConfigValue = new PostgreConfig(
            this.safelyGetString('postgre.command.host'),
            this.safelyGetString('postgre.command.username'),
            this.safelyGetString('postgre.command.database.name'),
            this.safelyGetString('postgre.command.password'),
            this.safelyGetNumber('postgre.command.port'),
            this.safelyGetNumber('postgre.command.max.pool')
        )
        this.queryPostgreConfigValue = new PostgreConfig(
            this.safelyGetString('postgre.query.host'),
            this.safelyGetString('postgre.query.username'),
            this.safelyGetString('postgre.query.database.name'),
            this.safelyGetString('postgre.query.password'),
            this.safelyGetNumber('postgre.query.port'),
            this.safelyGetNumber('postgre.query.max.pool')
        )
        this.redisConfigValue = new RedisConfig(
            this.safelyGetString('redis.host'),
            this.safelyGetNumber('redis.port')
        )
        this.bcryptConfigValue = new BcryptConfig(
            this.safelyGetNumber('bcrypt.salt.rounds')
        )
        this.authMQTopicsValue = new AuthMQTopics(
            this.safelyGetString('session.created.topic')
        )
        this.userMQTopicsValue = new UserMQTopics(
            this.safelyGetString('user.registered.topic')
        )
        this.authConfigValue = new AuthConfig(
            this.safelyGetNumber('access.token.expired.mins'),
            this.safelyGetNumber('session.expired.days')
        )
        this.userRateLimiterConfigValue = new UserRateLimiterConfig(
            this.safelyGetNumber('user.request.limit'),
            this.safelyGetNumber('user.request.time.seconds')
        )
        this.restAppConfigValue = new RestAppConfig(
            this.safelyGetNumber('rest.app.port')
        )
    }

    private getFromEnv(envKey: string): string {
        const envValue = process.env[envKey]
        if (envValue == undefined) {
            throw new Error(`key ${envKey} from env is undefined or not set yet`)
        }
        if (envValue == null) {
            throw new Error(`key ${envKey} from env is null`)
        }
        if (envValue.trim() == '') {
            throw new Error(`key ${envKey} from env is empty string`)
        }
        return envValue
    }

    private safelyGetString(configKey: string): string {
        return this.getFromEnv(configKey)
    }

    private safelyGetNumber(configKey: string): number {
        const envValue = this.getFromEnv(configKey)
        const numberConfigValue = Number(envValue)
        if (Number.isNaN(numberConfigValue) || !Number.isFinite(numberConfigValue)) {
            throw new Error(`key ${configKey} from env value of ${envValue} is not a valid number`)
        }
        return numberConfigValue
    }

    //@ts-ignore
    private safelyGetBoolean(configKey: string): boolean {
        const envValue = this.getFromEnv(configKey)
        const lowerCasedConfigValue = envValue.toLowerCase()
        if (lowerCasedConfigValue != 'true' && lowerCasedConfigValue != 'false') {
            throw new Error(`key ${configKey} from env value of ${envValue} is not a valid string for boolean`)
        }
        return lowerCasedConfigValue == 'true'
    }


    public kafkaConfig(): KafkaConfig {
        return this.kafkaConfigValue
    }

    public commandPostgreConfig(): PostgreConfig {
        return this.commandPostgreConfigValue
    }

    public queryPostgreConfig(): PostgreConfig {
        return this.queryPostgreConfigValue
    }

    public redisConfig(): RedisConfig {
        return this.redisConfigValue
    }

    public bcryptConfig(): BcryptConfig {
        return this.bcryptConfigValue
    }

    public authMqTopics(): AuthMQTopics {
        return this.authMQTopicsValue
    }

    public userMqTopics(): UserMQTopics {
        return this.userMQTopicsValue
    }

    public authConfig(): AuthConfig {
        return this.authConfigValue
    }

    public userRateLimiterConfig(): UserRateLimiterConfig {
        return this.userRateLimiterConfigValue
    }

    public restAppConfig(): RestAppConfig {
        return this.restAppConfigValue
    }
}