import {
    IAuthEventCommandRepository,
    IReturnedCreatedSession,
    ISessionToCreate
} from "../../.domains/auth.domain/auth.event";

import { ITransactionQueries } from "../../.domains/.shared.domain/sql.db";
import { sessionSchema } from "./.auth.repository.schema";

const bulkInsetSessionSql = "INSERT INTO sessions (session_id, user_id, expired_at) VALUES"
const returningInsetedSessionSql = "RETURNING session_id as sessionId, user_id as userId,expired_at as expiredAt ;"

export default class AuthEventCommandRepository implements IAuthEventCommandRepository {
    constructor(
        private readonly transactionalSql: ITransactionQueries,
    ) { }

    public async bulkUpsertSession(sessions: ISessionToCreate[]): Promise<IReturnedCreatedSession[]> {
        const sqlParams = this.transactionalSql.createSqlParams()
        let valuesSqlString: string = ''
        sessions.forEach((session, index) => {
            valuesSqlString += `($${index * 3 + 1},$${(index * 3) + 2},$${(index * 3) + 3}) ${index != sessions.length - 1 ? ',' : ''}`
            sqlParams.push(session.sessionId, session.userId, session.expiredAt)
        })
        const finalSql = bulkInsetSessionSql + valuesSqlString + returningInsetedSessionSql
        const insertedSessions = await this.transactionalSql.query(finalSql, sqlParams, sessionSchema)
        return insertedSessions
    }
}