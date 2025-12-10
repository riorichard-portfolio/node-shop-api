import Config from './.base.config'
import { IAuthConfig } from '../.domains/.shared.domain/config'

export default class AuthConfig extends Config implements IAuthConfig {
    private readonly accessTokenExpiredMinsValue: number
    private readonly sessionExpiredDaysValue: number

    constructor(
        accessTokenExpiredMins: number,
        sessionExpiredDays: number
    ) {
        super()
        this.accessTokenExpiredMinsValue = accessTokenExpiredMins
        this.sessionExpiredDaysValue = sessionExpiredDays
    }

    public accessTokenExpiredMins(): number {
        return this.accessTokenExpiredMinsValue
    }

    public sessionExpiredDays(): number {
        return this.sessionExpiredDaysValue
    }
}