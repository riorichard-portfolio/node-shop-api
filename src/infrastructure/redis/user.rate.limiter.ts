import RedisCache from "./.redis";

import { IUserRateLimiter } from '../../.domains/.shared.domain/rate.limiter'
import { IRedisConfig } from "../../.domains/.shared.domain/config";
import { IUserRateLimiterConfig } from "../../.domains/.shared.domain/config";


export default class UserRateLimiter extends RedisCache implements IUserRateLimiter {
    constructor(
        redisConfig: IRedisConfig,
        private readonly rateLimiterConfig: IUserRateLimiterConfig
    ) {
        super(redisConfig)
    }

    public async hasExceededLimit(userId: string): Promise<boolean> {
        const userRequestTimes = await this.incrementWithTTL(
            `request_times:user:${userId}`,
            this.rateLimiterConfig.userRequestTimeSeconds()
        )
        return userRequestTimes > this.rateLimiterConfig.userRequestLimit()
    }
}