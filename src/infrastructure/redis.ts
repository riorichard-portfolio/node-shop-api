import { Redis } from "ioredis";

import IMemoryCache from '../.domains/.shared.domain/memory.cache'
import { TRedisConfig } from "../config/config.instances/redis.config";

const errorNotNumberIncrement = "invalid operation increment: incrementWithTTL does not return number"

export default class RedisCache implements IMemoryCache {
    private readonly redis: Redis
    private readonly incrementWithTTLScript = `
        local current = redis.call('INCR', KEYS[1])
        if current == 1 then
                redis.call('EXPIRE', KEYS[1], ARGV[1])
        end
        return current
        `;

    constructor(config: TRedisConfig) {
        const newRedis = new Redis({
            host: config.REDIS_HOST,
            port: config.REDIS_PORT
        })
        this.redis = newRedis
        this.setupEventListeners()
    }

    private setupEventListeners(): void {
        this.redis.on('connect', () => {
            console.log('✅ Connected to Redis');
        });

        this.redis.on('ready', () => {
            console.log('✅ Redis ready for commands');
        });

        this.redis.on('error', (error) => {
            console.error('❌ Redis error:', error);
        });

        this.redis.on('close', () => {
            console.log('🔌 Redis connection closed');
        });

        this.redis.on('reconnecting', () => {
            console.log('🔄 Reconnecting to Redis...');
        })
    }

    public async isHealthy(): Promise<boolean> {
        try {
            await this.redis.ping()
            return true
        } catch (error) {
            console.error(`redis not healthy with error: \n${error}`)
            return false
        }
    }

    public async get(key: string): Promise<string | null> {
        const redisValue = await this.redis.get(key)
        return redisValue
    }

    public async setWithTTL(key: string, data: string | boolean | number | object, ttlSecond: number): Promise<void> {
        await this.redis.setex(
            key,
            ttlSecond,
            typeof data !== 'string' ? JSON.stringify(data) : data
        )
    }

    public async incrementWithTTL(key: string, ttlSecond: number): Promise<number> {
        const incrementedValue = await this.redis.eval(
            this.incrementWithTTLScript,
            1, // number of keys
            key,
            ttlSecond
        )
        if (typeof incrementedValue === 'number') {
            return incrementedValue
        } else {
            throw new Error(errorNotNumberIncrement)
        }
    }

    public async close(): Promise<void> {
        await this.redis.quit();
    }
}