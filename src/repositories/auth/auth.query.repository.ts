import { AuthQueryRepository as AuthQueryRepo, FindBySessionIdData } from "../../domains/auth.domain/auth.repository.domain";

import { QuerySchema, SqlQueryDB } from "../../domains/.shared.domain/sql.db";
import { RepositoryResult } from "../../domains/.shared.domain/types";
import Session, { SessionEntity } from "../../domains/auth.domain/session.entity";

const checkSessionSql = `select session_id as "sessionId" , user_id as "userId" , expired_at as "expiredAt" from sessions where session_id = $1`
const sessionSchema = {
    sessionId: 'string',
    userId: 'string',
    expiredAt: 'number'
} as const satisfies QuerySchema

export default class AuthQueryRepository implements AuthQueryRepo {
    private readonly sqlDb: SqlQueryDB
    constructor(
        sqlDb: SqlQueryDB,
    ) {
        this.sqlDb = sqlDb
    }

    public async findBySessionId(data: FindBySessionIdData): Promise<RepositoryResult<SessionEntity>> {
        const params = [data.sessionId()]
        const rows = await this.sqlDb.query(checkSessionSql, sessionSchema, params)
        const sessionFound = rows[0]
        if (sessionFound == undefined) {
            return {
                found: false,
            }
        }
        return {
            found: true,
            data() {
                return new Session(sessionFound.sessionId, sessionFound.userId, sessionFound.expiredAt)
            },
        }
    }
}