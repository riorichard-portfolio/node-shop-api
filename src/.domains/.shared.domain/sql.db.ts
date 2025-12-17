export type TParam = string | number | boolean | null
export interface IQuerySchema {
    [key: string]: 'string' | 'number' | 'boolean'
}

export type TSchemaToType<T extends IQuerySchema> = {
    [K in keyof T]:
    T[K] extends 'string' ? string :
    T[K] extends 'number' ? number :
    T[K] extends 'boolean' ? boolean :
    never
}

export interface ISqlQuery {
    createSqlParams(): TParam[]
    query(sql: string, params: TParam[]): Promise<null>
    query<const QuerySchema extends IQuerySchema>(
        sql: string,
        params: TParam[], // force to give any params , even limit or offset
        schema?: QuerySchema
    ): Promise<TSchemaToType<QuerySchema>[]>
}

export interface ITransactionQueries extends ISqlQuery { }

export interface ISqlDB extends ISqlQuery {
    sqlTransaction(executeQueries: (transactionQueries: ITransactionQueries) => Promise<void>): Promise<void>
}