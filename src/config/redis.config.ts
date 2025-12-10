import { IRedisConfig } from "../.domains/.shared.domain/config"
import Config from "./.base.config"

export default class RedisConfig extends Config implements IRedisConfig {
    private readonly hostValue: string
    private readonly portValue: number
    constructor(
        host: string,
        port: number
    ) {
        super()
        this.hostValue = host
        this.portValue = port
    }
    public host(): string {
        return this.hostValue
    }
    public port(): number {
        return this.portValue
    }
}