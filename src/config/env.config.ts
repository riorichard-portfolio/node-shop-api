import PostgreConfig, { TPostgreConfig } from "./config.instances/postgre.config";
import KafkaConfig, { TKafkaConfig } from "./config.instances/kafka.config";
import RedisConfig, { TRedisConfig } from "./config.instances/redis.config";

interface EnvLoader {
    load(): void
    pgEnvVars(): TPostgreConfig
    kafkaEnvVars(): TKafkaConfig
    redisEnvVars(): TRedisConfig
}

type NodeEnv = 'local' | 'development' | 'staging' | 'production'

const errorInvalidNodeEnv = 'invalid node env: must set either local | development | staging | production'
const errorNotIdempotentLoad = 'env inproper load: must load env only once'
const errorNoLoadEnv = 'env not loaded : please load the env first with load()'
const errorForcedGetNullEnvVars = 'env load with null: please properly load the env first'

export default class Env implements EnvLoader {
    private readonly nodeEnv: NodeEnv = 'local'
    private envLoaded: boolean = false
    private loadedPgEnvVars: TPostgreConfig | null = null
    private loadedKafkaEnvVars: TKafkaConfig | null = null
    private loadedRedisEnvVars: TRedisConfig | null = null

    constructor(nodeEnv?: NodeEnv) {
        if (nodeEnv !== undefined) {
            if (this.nodeEnvIsValid(nodeEnv)) {
                this.nodeEnv = nodeEnv
            } else {
                throw new Error(errorInvalidNodeEnv)
            }
        }
    }

    private nodeEnvIsValid(nodeEnv?: NodeEnv): boolean {
        if (typeof nodeEnv === 'string') {
            if (nodeEnv === 'local' || nodeEnv === 'development' || nodeEnv === 'staging' || nodeEnv === 'production') {
                return true
            }
        }
        return false
    }

    public load(): void {
        if (this.envLoaded) throw new Error(errorNotIdempotentLoad)
        const pg1EnvVars = new PostgreConfig('pgConfig1')
        const kafkaBroker1EnvVars = new KafkaConfig('kafkaConfig1')
        const redisEnvVars = new RedisConfig('redisConfig1')
        if (this.nodeEnv === 'local') {
            require('dotenv').config({ path: '.env.local' })
        }
        pg1EnvVars.SET_CONFIG_STRING('PG_DATABASE', process.env['PG_DATABASE'])
        pg1EnvVars.SET_CONFIG_STRING('PG_USER', process.env['PG_USER'])
        pg1EnvVars.SET_CONFIG_STRING('PG_PASSWORD', process.env['PG_PASSWORD'])
        pg1EnvVars.SET_CONFIG_STRING('PG_HOST', process.env['PG_HOST'])
        pg1EnvVars.SET_CONFIG_NUMBER('PG_PORT', process.env['PG_PORT'])
        pg1EnvVars.SET_CONFIG_NUMBER('PG_MAX_POOL', process.env['PG_MAX_POOL'])

        kafkaBroker1EnvVars.SET_CONFIG_STRING('KAFKA_BROKER_NODE', process.env['KAFKA_BROKER_NODE'])

        redisEnvVars.SET_CONFIG_STRING('REDIS_HOST', process.env['REDIS_HOST'])
        redisEnvVars.SET_CONFIG_NUMBER('REDIS_PORT', process.env['REDIS_PORT'])

        this.loadedPgEnvVars = pg1EnvVars.getAllVars()
        this.loadedKafkaEnvVars = kafkaBroker1EnvVars.getAllVars()
        this.loadedRedisEnvVars = redisEnvVars.getAllVars()
        pg1EnvVars.FINISH(); kafkaBroker1EnvVars.FINISH(); redisEnvVars.FINISH()
        this.envLoaded = true
    }

    public kafkaEnvVars(): TKafkaConfig {
        if (!this.envLoaded) throw new Error(errorNoLoadEnv)
        if (this.loadedKafkaEnvVars !== null) {
            return this.loadedKafkaEnvVars
        } else {
            throw new Error(errorForcedGetNullEnvVars)
        }
    }

    public pgEnvVars(): TPostgreConfig {
        if (!this.envLoaded) throw new Error(errorNoLoadEnv)
        if (this.loadedPgEnvVars !== null) {
            return this.loadedPgEnvVars
        } else {
            throw new Error(errorForcedGetNullEnvVars)
        }
    }

    public redisEnvVars(): TRedisConfig {
        if (!this.envLoaded) throw new Error(errorNoLoadEnv)
        if (this.loadedRedisEnvVars !== null) {
            return this.loadedRedisEnvVars
        } else {
            throw new Error(errorForcedGetNullEnvVars)
        }
    }
}