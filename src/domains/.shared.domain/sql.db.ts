export type SqlParams = readonly string[]
export type SqlStatement = readonly [string, SqlParams]

export default interface SqlDB {
    command(sql: string, params?: string[]): Promise<void>
    query(sql: string, params?: string[]): Promise<unknown>
}