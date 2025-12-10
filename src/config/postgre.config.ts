import { IPostgreConfig } from "../.domains/.shared.domain/config"
import Config from "./.base.config"

export default class PostgreConfig extends Config implements IPostgreConfig {
    private readonly hostValue: string
    private readonly usernameValue: string
    private readonly databaseNameValue: string
    private readonly passwordValue: string
    private readonly portValue: number
    private readonly maxPoolValue: number
    constructor(
        host: string,
        username: string,
        databaseName: string,
        password: string,
        port: number,
        maxPool: number
    ) {
        super()

        this.hostValue = host
        this.usernameValue = username
        this.databaseNameValue = databaseName
        this.passwordValue = password
        this.portValue = port
        this.maxPoolValue = maxPool
    }
    public host(): string {
        return this.hostValue
    }
    public username(): string {
        return this.usernameValue
    }
    public databaseName(): string {
        return this.databaseNameValue
    }
    public password(): string {
        return this.passwordValue
    }
    public port(): number {
        return this.portValue
    }

    public maxPool(): number {
        return this.maxPoolValue
    }
}