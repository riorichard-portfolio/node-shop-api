import { IAuthEventCommandRepository, ISessionToSync, ISessionToUpsert } from "../../.domains/auth.domain/auth.event.domain";

import { ITransactionQueries } from "../../.domains/.shared.domain/sql.db";

const bulkUpsertSessionSqlStart = ` INSERT INTO sessions (session_id, user_id, expired_at) VALUES`
const bulkUpsertSessionSqlEnd = `
ON CONFLICT (user_id) 
DO UPDATE SET 
    session_id = EXCLUDED.session_id,
    expired_at = EXCLUDED.expired_at,
    updated_at = NOW()
`

export default class AuthEventCommandRepository implements IAuthEventCommandRepository {
    constructor(
        private readonly transactionalSql: ITransactionQueries,
    ) { }

    public async bulkUpsertSession(sessions: ISessionToUpsert[]): Promise<ISessionToSync[]> {
        const sqlParams: string[] = []
        let valuesSqlString: string = ''
        sessions.forEach((session, index) => {
            valuesSqlString += `($${index * 3 + 1},$${(index * 3) + 2},$${(index * 3) + 3}) ${index != sessions.length - 1 ? ',' : ''}`
            sqlParams.push(session.sessionId, session.userId, session.expiredAt.toString())
        })
        const finalSql = bulkUpsertSessionSqlStart + valuesSqlString + bulkUpsertSessionSqlEnd
        await this.transactionalSql.query(finalSql, sqlParams)
    }
}