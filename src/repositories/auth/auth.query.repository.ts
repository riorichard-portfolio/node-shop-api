import { AuthQueryRepository as AuthQueryRepo } from "../../domains/auth.domain/auth.repository.domain";

import { SqlQueryDB } from "../../domains/.shared.domain/sql.db";

export default class AuthQueryRepository implements AuthQueryRepo {
    private readonly sqlDb: SqlQueryDB
    constructor(
        sqlDb: SqlQueryDB,
    ) {
        this.sqlDb = sqlDb
    }

    public async isSessionValid(sessionId: string): Promise<boolean> {
        const query = "select 1 from sessions where session_id = $1"
        const params = [sessionId]
        const rows = await this.sqlDb.query(query, ['number'], params)
        return rows.length > 0
    }
}