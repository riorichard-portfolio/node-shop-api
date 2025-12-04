import BcryptConfig from "../../config/bcrypt.config";
import KafkaConfig from "../../config/kafka.config";
import PostgreConfig from "../../config/postgre.config";
import RedisConfig from "../../config/redis.config";
import AuthMQTopics from "../../config/auth.mq.topics";
import UserMQTopics from "../../config/user.mq.topics";
import AuthConfig from '../../config/auth.config';
import UserRateLimiterConfig from '../../config/user.rate.limiter.config';

type NodeEnv = 'local' | 'development' | 'staging' | 'production'

export default class AppEnvConfig {
    private readonly nodeEnv: NodeEnv

    private readonly kafkaConfigValue: KafkaConfig
    private readonly postgreConfigValue: PostgreConfig
    private readonly redisConfigValue: RedisConfig
    private readonly bcryptConfigValue: BcryptConfig
    private readonly authMQTopicsValue: AuthMQTopics
    private readonly userMQTopicsValue: UserMQTopics
    private readonly authConfigValue: AuthConfig
    private readonly userRateLimiterConfigValue: UserRateLimiterConfig

    constructor(nodeEnv: string = 'local') {
        if (nodeEnv != 'local' && nodeEnv != 'development' && nodeEnv != 'staging' && nodeEnv != 'production') {
            throw new Error('node env must either local | development | staging | production')
        }
        this.nodeEnv = nodeEnv
        if (this.nodeEnv == 'local') {
            require('dotenv').config({ path: '.env.local' })
        }
        this.kafkaConfigValue = new KafkaConfig(
            process.env['kafka.broker.nodes'],
            process.env['kafka.clientid'],
            process.env['kafka.groupid']
        )
        this.postgreConfigValue = new PostgreConfig(
            process.env['postgre.host'],
            process.env['postgre.username'],
            process.env['postgre.database.name'],
            process.env['postgre.password'],
            process.env['postgre.port'],
            process.env['postgre.max.pool']
        )
        this.redisConfigValue = new RedisConfig(
            process.env['redis.host'],
            process.env['redis.port']
        )
        this.bcryptConfigValue = new BcryptConfig(
            process.env['bcrypt.salt.rounds']
        )
        this.authMQTopicsValue = new AuthMQTopics(
            process.env['session.created.topic']
        )
        this.userMQTopicsValue = new UserMQTopics(
            process.env['user.registered.topic']
        )
        this.authConfigValue = new AuthConfig(
            process.env['access.token.expired.mins'],
            process.env['session.expired.days']
        )
        this.userRateLimiterConfigValue = new UserRateLimiterConfig(
            process.env['user.request.limit'],
            process.env['user.request.time.seconds']
        )
    }

    public kafkaConfig(): KafkaConfig {
        return this.kafkaConfigValue
    }

    public postgreConfig(): PostgreConfig {
        return this.postgreConfigValue
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
}