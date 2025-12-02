import {
    IAuthMQTopics,
    IUserMQTopics
} from "../.domains/.shared.domain/message.broker.topics";
import {
    IAppConfig,
    IBcryptConfig,
    IKafkaConfig,
    IPostgreConfig,
    IRedisConfig
} from "../.domains/.shared.domain/config";

import BcryptConfig from "./bcrypt.config";
import KafkaConfig from "./kafka.config";
import PostgreConfig from "./postgre.config";
import RedisConfig from "./redis.config";
import AuthMQTopics from "./auth.mq.topics";
import UserMQTopics from "./user.mq.topics";

type NodeEnv = 'local' | 'development' | 'staging' | 'production'

export default class EnvConfigLoader implements IAppConfig {
    private readonly nodeEnv: NodeEnv

    private readonly kafkaConfigValue: IKafkaConfig
    private readonly postgreConfigValue: IPostgreConfig
    private readonly redisConfigValue: IRedisConfig
    private readonly bcryptConfigValue: IBcryptConfig
    private readonly authMQTopicsValue: IAuthMQTopics
    private readonly userMQTopicsValue: IUserMQTopics
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
    }

    public kafkaConfig(): IKafkaConfig {
        return this.kafkaConfigValue
    }

    public postgreConfig(): IPostgreConfig {
        return this.postgreConfigValue
    }

    public redisConfig(): IRedisConfig {
        return this.redisConfigValue
    }

    public bcryptConfig(): IBcryptConfig {
        return this.bcryptConfigValue
    }

    public authMqTopics(): IAuthMQTopics {
        return this.authMQTopicsValue
    }

    public userMqTopics(): IUserMQTopics {
        return this.userMQTopicsValue
    }
}