import Config from './.base.config'
import { IBcryptConfig } from '../.domains/.shared.domain/config'

export default class BcryptConfig extends Config implements IBcryptConfig {
    private readonly saltRoundsValue: number
    constructor(
        saltRounds: number
    ) {
        super()
        this.saltRoundsValue = saltRounds
    }

    public saltRounds(): number {
        return this.saltRoundsValue
    }
}