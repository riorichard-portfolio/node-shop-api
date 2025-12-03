import Config from './.base.config'
import { IRateLimiterConfig } from '../.domains/.shared.domain/config'

export default class RateLimiterConfig extends Config implements IRateLimiterConfig {
    private readonly userRequestLimitValue: number
    private readonly userRequestTimeSecondsValue: number

    constructor(
        userRequestLimit: unknown,
        userRequestTimeSeconds: unknown
    ) {
        super()
        this.userRequestLimitValue = this.safelyGetNumber(userRequestLimit)
        this.userRequestTimeSecondsValue = this.safelyGetNumber(userRequestTimeSeconds)
    }

    public userRequestLimit(): number {
        return this.userRequestLimitValue
    }

    public userRequestTimeSeconds(): number {
        return this.userRequestTimeSecondsValue
    }
}