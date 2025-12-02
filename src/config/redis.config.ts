import { IRedisConfig } from "../.domains/.shared.domain/config"
import Config from "./.base.config"

export default class RedisConfig extends Config implements IRedisConfig {
    private readonly hostValue: string
    private readonly portValue: number
    constructor(
        host: unknown,
        port: unknown
    ) {
        super()
        this.hostValue = this.safelyGetString(host)
        this.portValue = this.safelyGetNumber(port)
    }
    public host(): string {
        return this.hostValue
    }
    public port(): number {
        return this.portValue
    }
}