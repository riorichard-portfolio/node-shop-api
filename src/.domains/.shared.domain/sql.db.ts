export type TParam = string | number | boolean
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

export interface ISqlQueryDB {
    query<const T extends IQuerySchema>(
        sql: string,
        schema: T,
        params?: TParam[]
    ): Promise<TSchemaToType<T>[]>
}

export interface ISqlCommandDB {
    command(sql: string, params?: TParam[]): Promise<void>
}