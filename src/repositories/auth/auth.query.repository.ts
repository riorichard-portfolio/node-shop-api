import { AuthQueryRepository as AuthQueryRepo, ValidateSessionData, ValidSession } from "../../domains/auth.domain/auth.repository.domain";

import { QuerySchema, SqlQueryDB } from "../../domains/.shared.domain/sql.db";
import { RepositoryResult } from "../../domains/.shared.domain/types";

const checkSessionSql = `select 1 as "exists" from sessions where session_id = $1`
const sessionSchema = {
    exists: 'number'
} as const satisfies QuerySchema

export default class AuthQueryRepository implements AuthQueryRepo {
    private readonly sqlDb: SqlQueryDB
    constructor(
        sqlDb: SqlQueryDB,
    ) {
        this.sqlDb = sqlDb
    }

    public async validateSession(data: ValidateSessionData): Promise<RepositoryResult<ValidSession>> {
        const params = [data.sessionId()]
        const rows = await this.sqlDb.query(checkSessionSql, sessionSchema, params)
        if (rows.length <= 0) {
            return {
                found: false,
            }
        }
        return {
            found: true,
            data() {
                return {
                    isValid() {
                        return true
                    },
                }
            },
        }
    }
}