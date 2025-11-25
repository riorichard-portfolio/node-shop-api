import { FindByEmailData, UserQueryRepository as UserRepo } from "../../domains/user.domain/user.repository.domain";

import { QuerySchema, SqlQueryDB } from "../../domains/.shared.domain/sql.db";
import { RepositoryResult } from "../../domains/.shared.domain/types";
import User, { UserEntity } from "../../domains/user.domain/user.entity";

const userFindByEmailSchema = {
    userId: 'string',
    email: 'string',
    fullname: 'string',
    hashedPassword: 'string'
} as const satisfies QuerySchema

const userFindByEmailSql = 'select user_id as "userId", email,fullname,hashed_password as "hashedPassword" from users where email = $1'

export default class UserQueryRepository implements UserRepo {
    constructor(
        private readonly sqlDb: SqlQueryDB
    ) { }

    public async findByEmail(data: FindByEmailData): Promise<RepositoryResult<UserEntity>> {
        const params = [data.email()]
        const rows = await this.sqlDb.query(
            userFindByEmailSql,
            userFindByEmailSchema,
            params
        )
        const firstRow = rows[0]
        if (firstRow == undefined) {
            return {
                found: false
            }
        }
        return {
            found: true,
            data() {
                return new User(firstRow.email, firstRow.hashedPassword, firstRow.fullname, firstRow.userId)
            },
        }
    }
}