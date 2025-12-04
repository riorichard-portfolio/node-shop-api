import Config from './.base.config'
import { IUserRateLimiterConfig } from '../.domains/.shared.domain/config'

export default class UserRateLimiterConfig extends Config implements IUserRateLimiterConfig {
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