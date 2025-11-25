export type Param = string | number | boolean
export interface QuerySchema {
    [key: string]: 'string' | 'number' | 'boolean' 
}

export type SchemaToType<T extends QuerySchema> = {
    [K in keyof T]:
    T[K] extends 'string' ? string :
    T[K] extends 'number' ? number :
    T[K] extends 'boolean' ? boolean :
    never
}

export interface SqlQueryDB {
    query<const T extends QuerySchema>(
        sql: string,
        schema: T,
        params?: Param[]
    ): Promise<SchemaToType<T>[]>
}

export interface SqlCommandDB {
    command(sql: string, params?: Param[]): Promise<void>
}