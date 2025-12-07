type TValueTypes = 'string' | 'number' | 'boolean' | 'email' | 'uuid'
interface IObjectMessageSchema {
    [key: string]: TValueTypes
}
type TSchemaToType<T extends IObjectMessageSchema> = {
    [K in keyof T]:
    T[K] extends 'string' | 'email' | 'uuid' ? string :
    T[K] extends 'number' ? number :
    T[K] extends 'boolean' ? boolean :
    never
}

const emailRegex = /^(?!\.)(?!.*\.$)(?!.*\.\.)[a-zA-Z0-9!$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[45][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const invalidObjectMessageError = 'queue message is not valid object'

interface IValidMessageResult<ObjectMessageSchema extends IObjectMessageSchema> {
    isValidMessageData: true
    validatedMessageData(): TSchemaToType<ObjectMessageSchema>
}

interface IInvalidMessageResult {
    isValidMessageData: false
    reason(): string
}

type TSafelyGetMessageObjectResult<ObjectMessageSchema extends IObjectMessageSchema> =
    | IValidMessageResult<ObjectMessageSchema>
    | IInvalidMessageResult

class ValidMessageResult<ObjectMessageSchema extends IObjectMessageSchema> implements IValidMessageResult<ObjectMessageSchema> {
    public readonly isValidMessageData = true
    constructor(
        private readonly objectMessage: any
    ) { }
    public validatedMessageData(): TSchemaToType<ObjectMessageSchema> {
        return this.objectMessage
    }
}

class InvalidMessageResult implements IInvalidMessageResult {
    public readonly isValidMessageData = false
    constructor(
        private readonly reasonValue: string
    ) { }

    public reason(): string {
        return this.reasonValue
    }
}

export default class EventHandler {
    private mappedValueType(valueType: TValueTypes): 'string' | 'number' | 'boolean' {
        if (valueType == 'email' || valueType == 'uuid') return 'string'
        return valueType
    }

    private isStringValidEmail(unknownString: string): boolean {
        return emailRegex.test(unknownString)
    }


    private isStringValidUUID(unknownString: string): boolean {
        return uuidRegex.test(unknownString)
    }

    protected safelyGetMessageObject<const ObjectMessageSchema extends IObjectMessageSchema>(
        message: string,
        objectMessageSchema: ObjectMessageSchema
    ): TSafelyGetMessageObjectResult<ObjectMessageSchema> {
        try {
            const parsedMessage = JSON.parse(message)
            if (typeof parsedMessage != 'object' || parsedMessage == null || Array.isArray(parsedMessage)) {
                return new InvalidMessageResult(
                    invalidObjectMessageError
                )
            }
            let isValidData = true
            const invalidKeys: string[] = []
            for (const [key, valueType] of Object.entries(objectMessageSchema)) {
                if (typeof parsedMessage[key] != this.mappedValueType(valueType)) {
                    isValidData = false
                    invalidKeys.push(key)
                } else if (valueType == 'email' && typeof parsedMessage[key] == 'string') {
                    if (!this.isStringValidEmail(parsedMessage[key])) {
                        isValidData = false
                        invalidKeys.push(`${key}(email)`)
                    }
                } else if (valueType == 'uuid' && typeof parsedMessage[key] == 'string') {
                    if (!this.isStringValidUUID(parsedMessage[key])) {
                        isValidData = false
                        invalidKeys.push(`${key}(uuidV4/v5)`)
                    }
                }
            }
            if (isValidData) {
                return new ValidMessageResult(parsedMessage)
            } else {
                return new InvalidMessageResult(
                    `invalid keys: ${invalidKeys.join(',')}`
                )
            }
        } catch (error) {
            return new InvalidMessageResult(
                `unknown safely get message object error: ${error}`
            )
        }
    }
}