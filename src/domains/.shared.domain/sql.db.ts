export default interface SqlDB {
    command(sql: string, params?: string[]): Promise<void>
    query(sql: string, params?: string[]): Promise<unknown>
}