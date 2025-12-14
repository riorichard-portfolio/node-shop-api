import { IAuthQueryRepository, IFindBySessionIdData } from "../../.domains/auth.domain/auth.repository.domain";
import { IRepositoryResultFactory } from "../../.domains/.shared.domain/result.factory";

import { IQuerySchema, ISqlDB } from "../../.domains/.shared.domain/sql.db";
import { TRepositoryResults } from "../../.domains/.shared.domain/types";
import { ISessionEntity } from "../../.domains/auth.domain/auth.entities";
import { IAuthEntitiesFactory } from "src/.domains/auth.domain/auth.factories";

const checkSessionSql = `select session_id as "sessionId" , user_id as "userId" , expired_at as "expiredAt" from sessions where session_id = $1`
const sessionSchema = {
    sessionId: 'string',
    userId: 'string',
    expiredAt: 'number'
} as const satisfies IQuerySchema

export default class AuthQueryRepository implements IAuthQueryRepository {

    constructor(
        private readonly sqlDb: ISqlDB,
        private readonly resultFactory: IRepositoryResultFactory,
        private readonly entityFactory: IAuthEntitiesFactory
    ) { }

    public async findBySessionId(data: IFindBySessionIdData): Promise<TRepositoryResults<ISessionEntity>> {
        const params = [data.sessionId()]
        const rows = await this.sqlDb.query(checkSessionSql, params, sessionSchema)
        const sessionFound = rows[0]
        if (sessionFound == undefined) {
            return this.resultFactory.createNotFound()
        }
        return this.resultFactory.createFoundData(
            this.entityFactory.createSession(
                sessionFound.sessionId,
                sessionFound.userId,
                sessionFound.expiredAt
            ))
    }
}