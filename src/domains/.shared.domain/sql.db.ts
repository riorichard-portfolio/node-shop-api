type Param = string | number | boolean
type ColumnType = 'string' | 'boolean' | 'number'

export interface SqlQueryDB {
    query<const T extends ColumnType[]>(
        sql: string,
        columnTypes: T,
        params?: Param[]
    ): Promise<{
        [K in keyof T]: T[K] extends 'string' ? string :
        T[K] extends 'number' ? number :
        T[K] extends 'boolean' ? boolean : never
    }[]>
}

export interface SqlCommandDB {
    command(sql: string, params?: Param[]): Promise<void>
}