import crypto from 'crypto'

import {
    IAuthSyncDBOutboxCommandRepository,
    ISessionToSync
} from "../../.domains/auth.domain/auth.outbox.repository";

import { ITransactionQueries } from "../../.domains/.shared.domain/sql.db";

const bulkInsetOutboxSyncSessionSql = "insert _outbox_sync_db_sessions (session_id, user_id, expired_at, created_at,outbox_id) VALUES"

export default class AuthSyncDBOutboxCommandRepository implements IAuthSyncDBOutboxCommandRepository {
    constructor(
        private readonly transactionalSql: ITransactionQueries,
    ) { }

    public async bulkInsertSessionToSync(syncData: ISessionToSync[]): Promise<void> {
        const sqlParams = this.transactionalSql.createSqlParams()
        const createdAt = Date.now()
        let valuesSqlString: string = ''
        syncData.forEach((session, index) => {
            valuesSqlString += `($${(index * 5) + 1},$${(index * 5) + 2},$${(index * 5) + 3}),$${(index * 5) + 4} ,$${(index * 5) + 5} ${index != syncData.length - 1 ? ',' : ''}`
            sqlParams.push(session.sessionId, session.userId || null, session.expiredAt || null, createdAt, crypto.randomUUID())
        })
        const finalSql = bulkInsetOutboxSyncSessionSql + valuesSqlString
        await this.transactionalSql.query(finalSql, sqlParams)
    }
}