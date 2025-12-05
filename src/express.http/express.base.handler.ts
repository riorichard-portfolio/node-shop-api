import { Response } from "express"

type TValueTypes = 'string' | 'number' | 'boolean' | 'email' | 'uuid'

interface IObjectSchema {
    [key: string]: TValueTypes
}

type TSchemaToType<T extends IObjectSchema> = {
    [K in keyof T]:
    T[K] extends 'string' | 'email' | 'uuid' ? string :
    T[K] extends 'number' ? number :
    T[K] extends 'boolean' ? boolean :
    never
}

const emailRegex = /^(?!\.)(?!.*\.$)(?!.*\.\.)[a-zA-Z0-9!$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[45][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const invalidBodyOrQueryError = 'query or body is not valid object'
const internalErrorMessage = 'internal server error'

interface IValidObjectResult<ObjectSchema extends IObjectSchema> {
    isValidData: true
    validatedData(): TSchemaToType<ObjectSchema>
}

interface IInvalidObjectResult {
    isValidData: false
    getInvalidKeysMessages(): string[]
}

class ValidObjectResult<ObjectSchema extends IObjectSchema> implements IValidObjectResult<ObjectSchema> {
    public readonly isValidData = true
    constructor(
        private readonly bodyOrQuery: any
    ) { }
    public validatedData(): TSchemaToType<ObjectSchema> {
        return this.bodyOrQuery
    }
}

class InvalidObjectResult implements IInvalidObjectResult {
    public readonly isValidData = false
    constructor(
        private readonly invalidKeysMessages: string[]
    ) { }
    public getInvalidKeysMessages(): string[] {
        return this.invalidKeysMessages
    }
}

type TSafelyGetObjectResult<ObjectSchema extends IObjectSchema> =
    | IValidObjectResult<ObjectSchema>
    | IInvalidObjectResult

const invalidBodyStatusCode = 400
const successStatusCode = 200
const createdStatusCode = 201
const notFoundDataStatusCode = 404
const duplicationConstraintStatusCode = 409
const unauthorizedStatusCode = 401
const internalErrorStatusCode = 500

type TResponseMessage = string | string[]

export default class ExpressHandler {
    protected invalidDataResponse(response: Response, message: TResponseMessage) {
        return response.status(invalidBodyStatusCode).json({ message })
    }

    protected successResponse(response: Response, data: Record<string, string | number | boolean>) {
        return response.status(successStatusCode).json({ data })
    }

    protected createdResponse(response: Response) {
        return response.status(createdStatusCode)
    }

    protected notFoundResponse(response: Response, message: TResponseMessage) {
        return response.status(notFoundDataStatusCode).json({ message })
    }

    protected duplicationConstraintResponse(response: Response, message: TResponseMessage) {
        return response.status(duplicationConstraintStatusCode).json({ message })
    }

    protected unauthorizedResponse(response: Response, message: TResponseMessage) {
        return response.status(unauthorizedStatusCode).json({ message })
    }

    protected internalErrorResponse(response: Response) {
        return response.status(internalErrorStatusCode).json({ message: internalErrorMessage })
    }

    private mappedValueType(valueType: TValueTypes): 'string' | 'number' | 'boolean' {
        if (valueType == 'email' || valueType == 'uuid') return 'string'
        return valueType
    }

    protected safelyGetObject<const ObjectSchema extends IObjectSchema>(
        bodyOrQuery: any,
        objectSchema: ObjectSchema
    ): TSafelyGetObjectResult<ObjectSchema> {
        if (typeof bodyOrQuery == 'object' && bodyOrQuery != null) {
            let isValidData = true
            const invalidKeysMessages: string[] = []
            for (const [key, valueType] of Object.entries(objectSchema)) {
                if (typeof bodyOrQuery[key] != this.mappedValueType(valueType)) {
                    isValidData = false
                    invalidKeysMessages.push(`key ${key} is expected to be ${valueType}`)
                } else if (valueType == 'email' && typeof bodyOrQuery[key] == 'string') {
                    if (!this.isStringValidEmail(bodyOrQuery[key])) {
                        isValidData = false
                        invalidKeysMessages.push(this.invalidEmailMessage(key))
                    }
                } else if (valueType == 'uuid' && typeof bodyOrQuery[key] == 'string') {
                    if (!this.isStringValidUUID(bodyOrQuery[key])) {
                        isValidData = false
                        invalidKeysMessages.push(this.invalidUUIDMessage(key))
                    }
                }
            }
            if (isValidData) {
                return new ValidObjectResult(bodyOrQuery)
            } else {
                return new InvalidObjectResult(invalidKeysMessages)
            }
        } else {
            return new InvalidObjectResult([invalidBodyOrQueryError])
        }
    }

    private isStringValidEmail(unknownString: string): boolean {
        return emailRegex.test(unknownString)
    }

    private invalidEmailMessage(emailKey: string) {
        return `key ${emailKey} is not valid email`
    }

    private isStringValidUUID(unknownString: string): boolean {
        return uuidRegex.test(unknownString)
    }

    private invalidUUIDMessage(uuidKey: string) {
        return `key ${uuidKey} is not valid uuid v4 or v5`
    }
}