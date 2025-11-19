import { AuthQueryRepository as AuthQueryRepo } from "../../domains/auth.domain/auth.repository.domain";

import { SqlQueryDB } from "../../domains/.shared.domain/sql.db";

const checkSessionSql = "select 1 from sessions where session_id = $1"
const sessionColumns: ['number'] = ['number']

export default class AuthQueryRepository implements AuthQueryRepo {
    private readonly sqlDb: SqlQueryDB
    constructor(
        sqlDb: SqlQueryDB,
    ) {
        this.sqlDb = sqlDb
    }

    public async isSessionValid(sessionId: string): Promise<boolean> {
        const params = [sessionId]
        const rows = await this.sqlDb.query(checkSessionSql, sessionColumns, params)
        return rows.length > 0
    }
}