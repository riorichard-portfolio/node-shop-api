import Config from './.base.config'
import { IUserRateLimiterConfig } from '../.domains/.shared.domain/config'

export default class UserRateLimiterConfig extends Config implements IUserRateLimiterConfig {
    private readonly userRequestLimitValue: number
    private readonly userRequestTimeSecondsValue: number

    constructor(
        userRequestLimit: number,
        userRequestTimeSeconds: number
    ) {
        super()
        this.userRequestLimitValue = userRequestLimit
        this.userRequestTimeSecondsValue = userRequestTimeSeconds
    }

    public userRequestLimit(): number {
        return this.userRequestLimitValue
    }

    public userRequestTimeSeconds(): number {
        return this.userRequestTimeSecondsValue
    }
}