export interface SetConfig<
    TStringKeys extends string,
    TNumberKeys extends string,
    TBooleanKeys extends string
> {
    SET_CONFIG_STRING(configKey: TStringKeys, configData: unknown): this
    SET_CONFIG_NUMBER(configKey: TNumberKeys, configData: unknown): this
    SET_CONFIG_BOOLEAN(configKey: TBooleanKeys, configData: unknown): this
}

export interface GetConfig<
    TStringKeys extends string,
    TNumberKeys extends string,
    TBooleanKeys extends string
> {
    GET_CONFIG_STRING(configKey: TStringKeys): string
    GET_CONFIG_NUMBER(configKey: TNumberKeys): number
    GET_CONFIG_BOOLEAN(configKey: TBooleanKeys): boolean
}

export class Config<
    TStringKeys extends string,
    TNumberKeys extends string,
    TBooleanKeys extends string
>
    implements
    SetConfig<TStringKeys, TNumberKeys, TBooleanKeys>,
    GetConfig<TStringKeys, TNumberKeys, TBooleanKeys> {
    private config: Record<string, string | number | boolean | null> = {}
    private usedKeysRecord: Record<string, boolean> = {}
    private nameOfConfig: string;
    constructor(nameOfConfig: string, configKeys: (TStringKeys | TNumberKeys | TBooleanKeys)[]) {
        this.nameOfConfig = nameOfConfig
        configKeys.forEach(configKey => {
            this.config[configKey] = null
            this.usedKeysRecord[configKey] = false
        })
    }
    private idempotentSafetyValidateKey(configKey: TStringKeys | TNumberKeys | TBooleanKeys): void {
        if (configKey in this.config) {
            if (this.config[configKey] !== null) throw new Error(`invalid set operation: ${configKey} is already set in ${this.nameOfConfig}`)
        } else {
            throw new Error(`invalid config key: ${configKey} is not registered in config ${this.nameOfConfig}`)
        }
    }
    public SET_CONFIG_STRING(configKey: TStringKeys, configData: unknown): this {
        this.idempotentSafetyValidateKey(configKey)
        if (typeof configData === 'number') {
            this.config[configKey] = configData.toString()
        } else if (typeof configData === 'string') {
            this.config[configKey] = configData
        } else {
            throw new Error(
                `invalid config value: ${configKey} is not a number or a string 
                in config ${this.nameOfConfig} for SET_CONFIG_STRING`
            )
        }
        return this
    }

    public SET_CONFIG_NUMBER(configKey: TNumberKeys, configData: unknown): this {
        this.idempotentSafetyValidateKey(configKey)
        if (typeof configData === 'number') {
            this.config[configKey] = configData
        } else if (typeof configData === 'string') {
            const numberConfigData = Number(configData)
            if (Number.isNaN(numberConfigData)) {
                throw new Error(
                    `invalid config value: ${configKey} is not a valid string for number 
                    in config ${this.nameOfConfig} for SET_CONFIG_NUMBER`
                )
            } else {
                this.config[configKey] = numberConfigData
            }
        } else {
            throw new Error(
                `invalid config value: ${configKey} is not a number or a string 
                in config ${this.nameOfConfig} for SET_CONFIG_NUMBER`
            )
        }
        return this
    }

    public SET_CONFIG_BOOLEAN(configKey: TBooleanKeys, configData: unknown): this {
        this.idempotentSafetyValidateKey(configKey)
        if (typeof configData === 'boolean') {
            this.config[configKey] = configData
        } else if (typeof configData === 'string') {
            if (configData !== "true" && configData !== "false") {
                throw new Error(
                    `invalid config value: ${configKey} is not a valid string for boolean
                    in config ${this.nameOfConfig} for SET_CONFIG_BOOLEAN`
                )
            } else {
                this.config[configKey] = (configData === "true")
            }
        } else {
            throw new Error(
                `invalid config value: ${configKey} is not a boolean or a string 
                in config ${this.nameOfConfig} for SET_CONFIG_BOOLEAN`
            )
        }
        return this
    }
    // ✅ FUNCTION OVERLOAD SIGNATURES
    private getSaveConfig(configKey: TStringKeys, valueType: 'string'): string;
    private getSaveConfig(configKey: TNumberKeys, valueType: 'number'): number;
    private getSaveConfig(configKey: TBooleanKeys, valueType: 'boolean'): boolean;
    // ONLY IMPLEMENT ONCE FROM OVERLOAD SIGNATURES
    private getSaveConfig(
        configKey: TStringKeys | TNumberKeys | TBooleanKeys,
        valueType: 'string' | 'number' | 'boolean'
    ): string | number | boolean {
        if (this.config[configKey] !== undefined) {
            if (this.config[configKey] === null) {
                throw new Error(
                    `invalid value for key ${configKey}: please set value for the key first 
                    in config ${this.nameOfConfig}`
                )
            } else {
                if (typeof this.config[configKey] === valueType) {
                    this.usedKeysRecord[configKey] = true
                    return this.config[configKey]
                } else {
                    throw new Error(
                        `invalid value type for key ${configKey}: please get with proper type value for the key
                        in config ${this.nameOfConfig}`
                    )
                }
            }
        } else {
            throw new Error(
                `invalid config key: ${configKey} is not registered in config ${this.nameOfConfig} 
                use registered key instead to get config string`
            )
        }
    }
    public GET_CONFIG_STRING(configKey: TStringKeys): string {
        return this.getSaveConfig(configKey, 'string')
    }

    public GET_CONFIG_NUMBER(configKey: TNumberKeys): number {
        return this.getSaveConfig(configKey, 'number')
    }
    public GET_CONFIG_BOOLEAN(configKey: TBooleanKeys): boolean {
        return this.getSaveConfig(configKey, 'boolean')
    }
    public FINISH(): void {
        const nullKeys = Object.keys(this.config).filter(key => this.config[key] === null)
        if (nullKeys.length > 0) {
            throw new Error(`missing env variables: please set ${nullKeys.join(', ')} in ${this.nameOfConfig}`)
        }
        const unusedKeys = Object.keys(this.usedKeysRecord).filter(key => this.usedKeysRecord[key] === false)
        if (unusedKeys.length > 0) {
            throw new Error(`config keys not used properly: please use ${unusedKeys.join(', ')} properly
            or unset unused config keys in ${this.nameOfConfig}`)
        }
    }
}
