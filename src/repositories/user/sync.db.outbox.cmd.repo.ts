import {
    IUserSyncDBOutboxRepository,
    IUserToSync
} from '../../.domains/user.domain/user.outbox.repository'

import { ITransactionQueries } from "../../.domains/.shared.domain/sql.db"

const bulkInsetOutboxSyncUserSql = "insert _outbox_sync_db_sessions (session_id, user_id, expired_at, created_at) values"