import { IUserRateLimiter } from '../../.domains/.shared.domain/rate.limiter'

import { IUserRateLimiterConfig } from "../../.domains/.shared.domain/config";

interface IRateLimiterData {
    isExpired(): boolean
    isExceededLimit(limit: number): boolean
}

const msPerSecond = 1000;

class RateLimitData implements IRateLimiterData {
    private readonly expiredAtUnix: number
    private countValue: number = 1

    constructor(
        expiredAfterSeconds: number
    ) {
        this.expiredAtUnix = Date.now() + (expiredAfterSeconds * msPerSecond)
    }

    public isExceededLimit(limit: number): boolean {
        this.countValue++
        return this.countValue > limit
    }

    public isExpired(): boolean {
        return Date.now() > this.expiredAtUnix
    }

}

export default class LocalUserRateLimiter implements IUserRateLimiter {
    private rateLimiterCounts = new Map<string, IRateLimiterData>()
    private readonly rateLimiterCleanupWorker: NodeJS.Timeout
    private cleanupCounter = 0

    constructor(
        private readonly rateLimiterConfig: IUserRateLimiterConfig,
        cleanupEveryMs: number = 300
    ) {
        this.rateLimiterCleanupWorker = setInterval(() => {
            this.cleanupExpiredRateLimiter()
        }, cleanupEveryMs)
    }

    public async hasExceededLimit(userId: string): Promise<boolean> {
        const rateLimitCount = this.rateLimiterCounts.get(userId)
        if (rateLimitCount == undefined) {
            this.rateLimiterCounts.set(userId, new RateLimitData(
                this.rateLimiterConfig.userRequestTimeSeconds()
            ))
            return false
        }
        // force clean also give one last time grace period
        if (rateLimitCount.isExpired()) {
            this.forceCleanRateLimiter(userId)
            // this one time only still allowed to pass
            return false
        }

        if (
            rateLimitCount.isExceededLimit(this.rateLimiterConfig.userRequestLimit())
        ) {
            return true
        }

        return false
    }

    private forceCleanRateLimiter(userId: string) {
        this.rateLimiterCounts.delete(userId)
    }

    private cleanupExpiredRateLimiter() {
        for (const [userId, rateLimiterData] of this.rateLimiterCounts) {
            if (rateLimiterData.isExpired()) {
                this.rateLimiterCounts.delete(userId)
                this.cleanupCounter++
            }
        }
        if (this.cleanupCounter > 0) {
            console.log(`cleanup user rate limiter count, cleaned counted: ${this.cleanupCounter}`)
            this.cleanupCounter = 0
        }
    }

    public stop() {
        if (this.rateLimiterCleanupWorker) {
            clearInterval(this.rateLimiterCleanupWorker)
        }
    }
}