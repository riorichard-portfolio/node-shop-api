import { AuthEventCommandRepository as AuthRepo, SessionTuple } from "../../domains/auth.domain/auth.event.domain";

import { SqlCommandDB } from "../../domains/.shared.domain/sql.db";

const bulkUpsertSessionSqlStart = ` INSERT INTO sessions (session_id, user_id, expired_at) VALUES`
const bulkUpsertSessionSqlEnd = `
ON CONFLICT (user_id) 
DO UPDATE SET 
    session_id = EXCLUDED.session_id,
    expired_at = EXCLUDED.expired_at,
    updated_at = NOW()
`

export default class AuthEventCommandRepository implements AuthRepo {
    private readonly sqlDb: SqlCommandDB
    constructor(
        sqlDb: SqlCommandDB,
    ) {
        this.sqlDb = sqlDb
    }

    public async bulkInsertSession(sessions: SessionTuple[]): Promise<void> {
        const sqlParams: Parameters<SqlCommandDB['command']>[1] = []
        let valuesSql: string[] = []
        let counter = 1
        sessions.forEach(session => {
            let eachValueSql: string[] = []
            session.forEach(sessionParam => {
                sqlParams.push(sessionParam)
                eachValueSql.push(`$${counter++}`)
            })
            valuesSql.push("(" + eachValueSql.join(',') + ")")
        })
        const finalSql = bulkUpsertSessionSqlStart + valuesSql.join(',') + bulkUpsertSessionSqlEnd
        await this.sqlDb.command(finalSql, sqlParams)
    }
}