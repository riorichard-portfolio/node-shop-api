export default class Config {
    private verifyDataIsValid(unknownConfigValue: unknown, configKey: string) {
        if (unknownConfigValue == null || unknownConfigValue == undefined) {
            throw new Error(`${configKey} config value is not valid value , is null or undefined`)
        }
    }

    protected safelyGetString(unknownConfigValue: unknown, configKey: string = ''): string {
        this.verifyDataIsValid(unknownConfigValue, configKey)
        if (typeof unknownConfigValue == 'string') return unknownConfigValue
        try {
            return JSON.stringify(unknownConfigValue)
        } catch (error) {
            throw new Error(`internal error stingify config key ${configKey} with value ${unknownConfigValue} with error\n ${error}`)
        }
    }

    protected safelyGetNumber(unknownConfigValue: unknown, configKey: string = ''): number {
        this.verifyDataIsValid(unknownConfigValue, configKey)
        if (typeof unknownConfigValue == 'number') return unknownConfigValue
        const numberConfigValue = Number(unknownConfigValue)
        if (Number.isNaN(numberConfigValue) || !Number.isFinite(numberConfigValue)) {
            throw new Error(`${configKey} config value of ${unknownConfigValue} is not a valid number`)
        }
        return numberConfigValue
    }

    protected safelyGetBoolean(unknownConfigValue: unknown, configKey: string = ''): boolean {
        this.verifyDataIsValid(unknownConfigValue, configKey)
        if (typeof unknownConfigValue == 'boolean') return unknownConfigValue
        if (typeof unknownConfigValue != 'string') {
            throw new Error(`${configKey} config value of ${unknownConfigValue} is not a string for boolean convertion`)
        } else {
            const lowerCasedConfigValue = unknownConfigValue.toLowerCase()
            if (lowerCasedConfigValue != 'true' && lowerCasedConfigValue != 'false') {
                throw new Error(`${configKey} config value of ${unknownConfigValue} is not a valid string for boolean`)
            }
            return lowerCasedConfigValue == 'true'
        }
    }

    protected safelyConvertToArray(unknownConfigValue: unknown, configKey: string = ''): unknown[] {
        try {
            if (Array.isArray(unknownConfigValue)) return unknownConfigValue
            if (typeof unknownConfigValue != 'string') {
                throw new Error(`${configKey} config value of ${unknownConfigValue} is not a string for parsing to array`)
            }
            const parsedConfigValue = JSON.parse(unknownConfigValue)
            if (!Array.isArray(parsedConfigValue)) {
                throw new Error(`${configKey} config value of ${unknownConfigValue} is not a valid array`)
            }
            return parsedConfigValue
        } catch (error) {
            throw new Error(`internal error parsing config key ${configKey} with value ${unknownConfigValue} with error\n ${error}`)
        }
    }
}