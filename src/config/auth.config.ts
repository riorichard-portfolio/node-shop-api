import Config from './.base.config'
import { IAuthConfig } from '../.domains/.shared.domain/config'

export default class AuthConfig extends Config implements IAuthConfig {
    private readonly accessTokenExpiredMinsValue: number
    private readonly sessionExpiredDaysValue: number

    constructor(
        accessTokenExpiredMins: unknown,
        sessionExpiredDays: unknown
    ) {
        super()
        this.accessTokenExpiredMinsValue = this.safelyGetNumber(accessTokenExpiredMins)
        this.sessionExpiredDaysValue = this.safelyGetNumber(sessionExpiredDays)
    }

    public accessTokenExpiredMins(): number {
        return this.accessTokenExpiredMinsValue
    }

    public sessionExpiredDays(): number {
        return this.sessionExpiredDaysValue
    }
}