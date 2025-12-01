import {
    IAppConfig,
    IBcryptConfig,
    IKafkaConfig,
    IPostgreConfig,
    IRedisConfig
} from "../.domains/.shared.domain/config";
import BcryptConfig from "./config.instances/bcrypt.config";
import KafkaConfig from "./config.instances/kafka.config";
import PostgreConfig from "./config.instances/postgre.config";
import RedisConfig from "./config.instances/redis.config";

type NodeEnv = 'local' | 'development' | 'staging' | 'production'

export default class EnvConfigLoader implements IAppConfig {
    private readonly nodeEnv: NodeEnv

    private readonly kafkaConfigValue: IKafkaConfig
    private readonly postgreConfigValue: IPostgreConfig
    private readonly redisConfigValue: IRedisConfig
    private readonly bcryptConfigValue: IBcryptConfig
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
}