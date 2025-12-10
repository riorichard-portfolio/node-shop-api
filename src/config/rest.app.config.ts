import Config from './.base.config'
import { IRestAppConfig } from '../.domains/.shared.domain/config'

export default class RestAppConfig extends Config implements IRestAppConfig {
    private readonly portValue: number

    constructor(
        port: number
    ) {
        super()
        this.portValue = port
    }

    public port(): number {
        return this.portValue
    }
}