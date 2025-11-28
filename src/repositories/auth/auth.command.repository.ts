import { IAuthEventCommandRepository, ISessionToUpsert } from "../../domains/auth.domain/auth.event.domain";

import { ISqlCommandDB } from "../../domains/.shared.domain/sql.db";

const bulkUpsertSessionSqlStart = ` INSERT INTO sessions (session_id, user_id, expired_at) VALUES`
const bulkUpsertSessionSqlEnd = `
ON CONFLICT (user_id) 
DO UPDATE SET 
    session_id = EXCLUDED.session_id,
    expired_at = EXCLUDED.expired_at,
    updated_at = NOW()
`

export default class AuthEventCommandRepository implements IAuthEventCommandRepository {
    private readonly sqlDb: ISqlCommandDB
    constructor(
        sqlDb: ISqlCommandDB,
    ) {
        this.sqlDb = sqlDb
    }

    public async bulkUpsertSession(sessions: ISessionToUpsert[]): Promise<void> {
        const sqlParams: Parameters<ISqlCommandDB['command']>[1] = []
        let valuesSqlString: string = ''
        sessions.forEach((session, index) => {
            valuesSqlString += `($${index * 3 + 1},$${(index * 3) + 2},$${(index * 3) + 3}) ${index != sessions.length - 1 ? ',' : ''}`
            sqlParams.push(session.sessionId, session.userId, session.expiredAt)
        })
        const finalSql = bulkUpsertSessionSqlStart + valuesSqlString + bulkUpsertSessionSqlEnd
        await this.sqlDb.command(finalSql, sqlParams)
    }
}