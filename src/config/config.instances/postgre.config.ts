import { Config } from '../../.core.internal.framework/internal.framework'

type PostgreStringKeys =
    | "PG_HOST"
    | "PG_USER"
    | "PG_PASSWORD"
    | "PG_DATABASE"

type PostgreNumberKeys =
    | "PG_PORT"
    | "PG_MAX_POOL"


const postgreKeys: (PostgreStringKeys | PostgreNumberKeys)[] = [
    "PG_HOST",
    "PG_USER",
    "PG_PASSWORD",
    "PG_DATABASE",
    "PG_PORT",
    "PG_MAX_POOL"
]

export type TPostgreConfig = {
    [K in PostgreStringKeys | PostgreNumberKeys]:
    K extends PostgreNumberKeys ? number : string
}


export default class PostgreConfig extends Config<PostgreStringKeys, PostgreNumberKeys, never> {
    constructor(pgCfgName: string) {
        super(pgCfgName, postgreKeys)
    }

    public getAllVars(): TPostgreConfig {
        return {
            PG_HOST: this.GET_CONFIG_STRING("PG_HOST"),
            PG_USER: this.GET_CONFIG_STRING("PG_USER"),
            PG_PASSWORD: this.GET_CONFIG_STRING("PG_PASSWORD"),
            PG_DATABASE: this.GET_CONFIG_STRING("PG_DATABASE"),
            PG_PORT: this.GET_CONFIG_NUMBER("PG_PORT"),
            PG_MAX_POOL: this.GET_CONFIG_NUMBER("PG_MAX_POOL")
        }
    }
}