import crypto from 'crypto'

import {
    IUserSyncDBOutboxCommandRepository,
    IUserToSync
} from '../../.domains/user.domain/user.outbox.repository'

import { ITransactionQueries } from "../../.domains/.shared.domain/sql.db"

const bulkInsetOutboxSyncUserSql = "insert _outbox_sync_db_users (outbox_id, user_id, fullname, hashed_password , created_at) values"

export default class UserSyncDBOutboxCommandRepository implements IUserSyncDBOutboxCommandRepository {
    constructor(
        private readonly transactionalSql: ITransactionQueries,
    ) { }

    public async bulkInsertUserToSync(syncData: IUserToSync[]): Promise<void> {
        const sqlParams = this.transactionalSql.createSqlParams()
        const createdAt = Date.now()
        let valuesSqlString = ''
        syncData.forEach((userToSync, index) => {
            valuesSqlString += `($${(index * 5) + 1},$${(index * 5) + 2},$${(index * 5) + 3}),$${(index * 5) + 4} ,$${(index * 5) + 5} ${index != syncData.length - 1 ? ',' : ''}`
            sqlParams.push(crypto.randomUUID(), userToSync.userId, userToSync.fullname || null, userToSync.hashedPassword || null, createdAt)
        })
        const finalSql = bulkInsetOutboxSyncUserSql + valuesSqlString
        await this.transactionalSql.query(finalSql, sqlParams)
    }
}