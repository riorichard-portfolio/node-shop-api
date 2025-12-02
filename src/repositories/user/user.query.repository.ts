import { IFindByEmailData, IUserQueryRepository } from "../../.domains/user.domain/user.repository.domain";
import { IRepositoryResultFactory } from "../../.domains/.shared.domain/result.factory";

import { IQuerySchema, ISqlQueryDB } from "../../.domains/.shared.domain/sql.db";
import { TRepositoryResults } from "../../.domains/.shared.domain/types";
import { IUserEntity } from "../../.domains/user.domain/user.entities";
import { IUserEntitiesFactory } from "../../.domains/user.domain/user.factories";

const userFindByEmailSchema = {
    userId: 'string',
    email: 'string',
    fullname: 'string',
    hashedPassword: 'string'
} as const satisfies IQuerySchema

const userFindByEmailSql = 'select user_id as "userId", email,fullname,hashed_password as "hashedPassword" from users where email = $1'

export default class UserQueryRepository implements IUserQueryRepository {
    constructor(
        private readonly sqlDb: ISqlQueryDB,
        private readonly resultFactory: IRepositoryResultFactory,
        private readonly entityFactory: IUserEntitiesFactory
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
            return this.resultFactory.createNotFound()
        }
        return this.resultFactory.createFoundData(
            this.entityFactory.createUser(
                firstRow.email,
                firstRow.hashedPassword,
                firstRow.fullname,
                firstRow.userId
            ))

    }
}