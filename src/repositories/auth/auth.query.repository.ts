import { IAuthQueryRepository , IFindBySessionIdData } from "../../domains/auth.domain/auth.repository.domain";

import { IQuerySchema, ISqlQueryDB } from "../../domains/.shared.domain/sql.db";
import { TRepositoryResults } from "../../domains/.shared.domain/types";
import Session, { ISessionEntity } from "../../domains/auth.domain/session.entity";

const checkSessionSql = `select session_id as "sessionId" , user_id as "userId" , expired_at as "expiredAt" from sessions where session_id = $1`
const sessionSchema = {
    sessionId: 'string',
    userId: 'string',
    expiredAt: 'number'
} as const satisfies IQuerySchema

export default class AuthQueryRepository implements IAuthQueryRepository {
    private readonly sqlDb: ISqlQueryDB
    constructor(
        sqlDb: ISqlQueryDB,
    ) {
        this.sqlDb = sqlDb
    }

    public async findBySessionId(data: IFindBySessionIdData): Promise<TRepositoryResults<ISessionEntity>> {
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