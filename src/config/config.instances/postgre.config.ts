import { IPostgreConfig } from "../../.domains/.shared.domain/config"
import Config from "./.base.config"

export default class PostgreConfig extends Config implements IPostgreConfig {
    private readonly hostValue: string
    private readonly usernameValue: string
    private readonly databaseNameValue: string
    private readonly passwordValue: string
    private readonly portValue: number
    private readonly maxPoolValue: number
    constructor(
        host: unknown,
        username: unknown,
        databaseName: unknown,
        password: unknown,
        port: unknown,
        maxPool: unknown
    ) {
        super()

        this.hostValue = this.safelyGetString(host)
        this.usernameValue = this.safelyGetString(username)
        this.databaseNameValue = this.safelyGetString(databaseName)
        this.passwordValue = this.safelyGetString(password)
        this.portValue = this.safelyGetNumber(port)
        this.maxPoolValue = this.safelyGetNumber(maxPool)
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