export type SqlParams = readonly string[]
export type SqlStatement = readonly [string, SqlParams]

export default interface SqlDB {
    command(statement: SqlStatement): Promise<void>
    query(statement: SqlStatement): Promise<unknown>
    prepareSql(sql: string, params?: string[]): SqlStatement 
}