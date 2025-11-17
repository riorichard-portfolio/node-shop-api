import { Config } from '../../.core.internal.framework/internal.framework'

type RedisStringKeys =
    | "REDIS_HOST"

type RedisNumberKeys =
    | "REDIS_PORT"

const redisKeys: (RedisStringKeys | RedisNumberKeys)[] = [
    "REDIS_HOST",
    "REDIS_PORT"
]

export type TRedisConfig = {
    [K in RedisStringKeys | RedisNumberKeys]:
    K extends RedisStringKeys ? string : number
}

export default class RedisConfig extends Config<RedisStringKeys, RedisNumberKeys, never> {
    constructor(redisCfgName: string) {
        super(redisCfgName, redisKeys)
    }

    public getAllVars(): TRedisConfig {
        return {
            REDIS_HOST: this.GET_CONFIG_STRING('REDIS_HOST'),
            REDIS_PORT: this.GET_CONFIG_NUMBER('REDIS_PORT')
        }
    }
}