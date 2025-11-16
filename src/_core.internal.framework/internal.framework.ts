/** 
interface SetEntityProperties<
    TStringPropNames extends string,
    TNumberPropNames extends string,
    TBooleanPropNames extends string
> {
    SET_PRIMARY_ID(idValue: string): this
    SET_PROP_STRING(propName: TStringPropNames, propValue: string): this
    SET_PROP_NUMBER(propName: TNumberPropNames, propValue: number): this
    SET_PROP_BOOLEAN(propName: TBooleanPropNames, propValue: boolean): this
}

interface GetEntityProperties<
    TStringPropNames extends string,
    TNumberPropNames extends string,
    TBooleanPropNames extends string
> {
    GET_PRIMARY_ID(): string
    GET_PROP_STRING(propName: TStringPropNames): string
    GET_PROP_NUMBER(propName: TNumberPropNames): number
    GET_PROP_BOOLEAN(propName: TBooleanPropNames): boolean
    GET_DTO(): [TStringPropNames | TNumberPropNames | TBooleanPropNames, string | number | boolean][]
}

interface EntityProceduralEnforcement {
    FINISH_WITH_PROCEDURAL_ENFORCEMENT(): void
}
*/

type ValueType = 'string' | 'number' | 'boolean'
type IsUsed = boolean

type entityPropertyValue = string | number | boolean | null
type PropertyDetails = [
    isUsed: IsUsed,
    value: entityPropertyValue,
    valueType: ValueType
]

export class Entity
    <
        TStringPropNames extends string,
        TNumberPropNames extends string,
        TBooleanPropNames extends string
    >
/** 
implements
SetEntityProperties<
    TStringPropNames,
    TNumberPropNames,
    TBooleanPropNames
>,
GetEntityProperties<
    TStringPropNames,
    TNumberPropNames,
    TBooleanPropNames
>,
EntityProceduralEnforcement 
*/ {
    private readonly properties: [TStringPropNames | TNumberPropNames | TBooleanPropNames, ...PropertyDetails][] = []

    private readonly entityName: string
    private entityId: string | null = null

    constructor(
        entityName: string,
        props: [
            (TStringPropNames | TNumberPropNames | TBooleanPropNames), ValueType
        ][]
    ) {
        this.entityName = entityName
        props.forEach(propNameAndType => {
            const propName = propNameAndType[0]
            const propValueType = propNameAndType[1]
            this.properties.push([
                propName,
                false,
                null,
                propValueType
            ])
        })
    }

    private idempotentSafeSet(
        propName: TStringPropNames | TNumberPropNames | TBooleanPropNames,
        propValue: entityPropertyValue
    ): void {
        for (const [indexProp, prop] of this.properties.entries()) {
            if (prop[0] === propName) {
                if (prop[2] !== null) {
                    throw new Error(
                        `invalid set operation: property ${propName} already set in entity ${this.entityName}`
                    )
                } else if (typeof propValue !== prop[3]) {
                    throw new Error(
                        `invalid set operation: property type of ${propName} does not match in registered type ${prop[3]}`
                    )
                }
                if (this.properties[indexProp] !== undefined) {
                    this.properties[indexProp][2] = propValue
                    return
                } else {
                    throw new Error(
                        `internal error: property ${propName} lost in entity ${this.entityName}`
                    )
                }
            }
        }
        throw new Error(
            `invalid property name: property ${propName} doesn't registered in entity ${this.entityName}`
        )
    }

    protected SET_PRIMARY_ID(id: string): this {
        if (this.entityId !== null) throw new Error(
            `invalid set primary id: primary id already set in entity ${this.entityName}`
        )
        this.entityId = id
        return this
    }
    protected SET_PROP_STRING(propName: TStringPropNames, propValue: string): this {
        this.idempotentSafeSet(propName, propValue)
        return this
    }
    protected SET_PROP_BOOLEAN(propName: TBooleanPropNames, propValue: boolean): this {
        this.idempotentSafeSet(propName, propValue)
        return this
    }
    protected SET_PROP_NUMBER(propName: TNumberPropNames, propValue: number): this {
        this.idempotentSafeSet(propName, propValue)
        return this
    }
    protected GET_PRIMARY_ID(): string {
        if (this.entityId === null) throw new Error(
            `invalid get primary id: primary id not set in entity ${this.entityName}`
        )
        return this.entityId
    }

    // function overload
    private getPropValueSafe(propName: TStringPropNames, propType: 'string'): string;
    private getPropValueSafe(propName: TNumberPropNames, propType: 'number'): number;
    private getPropValueSafe(propName: TBooleanPropNames, propType: 'boolean'): boolean;

    private getPropValueSafe(
        propName: TStringPropNames | TNumberPropNames | TBooleanPropNames,
        propType: ValueType
    ): string | number | boolean {
        let propValue: string | number | boolean | undefined
        for (const [indexProp, prop] of this.properties.entries()) {
            if (prop[0] === propName) {
                if (prop[2] === null) {
                    throw new Error(`invalid get operation: property ${propName} is null please set first`)
                } else if (typeof prop[2] !== propType) {
                    throw new Error(`invalid get operation: property ${propName} type is ${typeof prop[2]} please get properly`)
                }
                propValue = prop[2]
                if (this.properties[indexProp] !== undefined) {
                    this.properties[indexProp][1] = true
                } else {
                    throw new Error(
                        `internal error: property ${propName} lost in entity ${this.entityName}`
                    )
                }
            }
        }
        if (propValue === undefined) throw new Error(
            `invalid property name: property ${propName} doesn't registered in entity ${this.entityName}`
        )
        return propValue
    }

    protected GET_PROP_STRING(propName: TStringPropNames): string {
        return this.getPropValueSafe(propName, 'string')
    }
    protected GET_PROP_BOOLEAN(propName: TBooleanPropNames): boolean {
        return this.getPropValueSafe(propName, 'boolean')
    }
    protected GET_PROP_NUMBER(propName: TNumberPropNames): number {
        return this.getPropValueSafe(propName, 'number')
    }
    protected GET_DTO(): [TStringPropNames | TNumberPropNames | TBooleanPropNames, string | number | boolean][] {
        const DTO: [TStringPropNames | TNumberPropNames | TBooleanPropNames, string | number | boolean][] = []
        for (const [indexProp, prop] of this.properties.entries()) {
            if (prop[2] !== null) {
                DTO.push([
                    prop[0],
                    prop[2]
                ])
            }
            if (this.properties[indexProp] !== undefined) {
                this.properties[indexProp][1] = true
            } else {
                throw new Error(
                    `internal error: property ${prop[0]} lost in entity ${this.entityName}`
                )
            }
        }
        if (DTO.length < 1) throw new Error(`invalid DTO operation: at least set 1 of property in ${this.entityName}`)
        return DTO
    }
    protected FINISH_WITH_PROCEDURAL_ENFORCEMENT(): void {
        for (const [_, prop] of this.properties.entries()) {
            if (prop[2] !== null && !prop[1]) {
                throw new Error(`invalid entity use: property ${prop[0]} unused in ${this.entityName} please set & get properly to avoid unused entity prop`)
            }
        }
    }
}

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
