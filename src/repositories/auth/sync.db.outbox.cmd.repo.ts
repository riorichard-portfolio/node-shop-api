import { IAuthSyncDBOutboxCommandRepository, ISessionToSync } from "../../.domains/auth.domain/auth.event.domain";

import { ITransactionQueries } from "../../.domains/.shared.domain/sql.db";

const bulkInsetOutboxSyncSessionSql = "insert _outbox_sync_db_sessions (session_id, user_id, expired_at, created_at) VALUES"

export default class AuthSyncDBOutboxCommandRepository implements IAuthSyncDBOutboxCommandRepository {
    constructor(
        private readonly transactionalSql: ITransactionQueries,
    ) { }

    public async bulkInsertSessionToSync(syncData: ISessionToSync[]): Promise<void> {
        const sqlParams = this.transactionalSql.createSqlParams()
        const createdAt = Date.now()
        let valuesSqlString: string = ''
        syncData.forEach((session, index) => {
            valuesSqlString += `($${(index * 4) + 1},$${(index * 4) + 2},$${(index * 4) + 3}),$${(index * 4) + 4} ${index != syncData.length - 1 ? ',' : ''}`
            sqlParams.push(session.sessionId, session.userId || null, session.expiredAt || null, createdAt)
        })
        const finalSql = bulkInsetOutboxSyncSessionSql + valuesSqlString
        await this.transactionalSql.query(finalSql, sqlParams)
    }
}