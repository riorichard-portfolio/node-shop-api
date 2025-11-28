import { IFindByEmailData, IUserQueryRepository  } from "../../domains/user.domain/user.repository.domain";

import { IQuerySchema, ISqlQueryDB } from "../../domains/.shared.domain/sql.db";
import { TRepositoryResults } from "../../domains/.shared.domain/types";
import User, { IUserEntity } from "../../domains/user.domain/user.entity";

const userFindByEmailSchema = {
    userId: 'string',
    email: 'string',
    fullname: 'string',
    hashedPassword: 'string'
} as const satisfies IQuerySchema

const userFindByEmailSql = 'select user_id as "userId", email,fullname,hashed_password as "hashedPassword" from users where email = $1'

export default class UserQueryRepository implements IUserQueryRepository {
    constructor(
        private readonly sqlDb: ISqlQueryDB
    ) { }

    public async findByEmail(data: IFindByEmailData): Promise<TRepositoryResults<IUserEntity>> {
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