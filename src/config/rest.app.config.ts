import Config from './.base.config'
import { IRestAppConfig } from '../.domains/.shared.domain/config'

export default class RestAppConfig extends Config implements IRestAppConfig {
    private readonly portValue: number

    constructor(
        port: unknown
    ) {
        super()
        this.portValue = this.safelyGetNumber(port)
    }

    public port(): number {
        return this.portValue
    }
}