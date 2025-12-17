import {
    IReturnedCreatedUser,
    IUserEventCommandRepository,
    IUserToInsert
} from "../../.domains/user.domain/user.event";

import { ITransactionQueries } from "../../.domains/.shared.domain/sql.db";
import { userSchema } from "./.user.repository.schema";

const bulkInsertUserSql = `insert into users (user_id, email,fullname, hashed_password) values`
const returningInsetedUsersSql = "RETURNING user_id as userId, email,fullname,hashed_password as hashedPassword;"

export default class UserEventCommandRepository implements IUserEventCommandRepository {
    constructor(
        private readonly transactionalSql: ITransactionQueries,
    ) { }

    public async bulkInsertUser(users: IUserToInsert[]): Promise<IReturnedCreatedUser[]> {
        const sqlParams = this.transactionalSql.createSqlParams()
        let valuesSqlString: string = ''
        users.forEach((user, index) => {
            valuesSqlString += `($${index * 4 + 1},$${(index * 4) + 2},$${(index * 4) + 3},$${(index * 4) + 4}) ${index != users.length - 1 ? ',' : ''}`
            sqlParams.push(user.userId, user.email, user.fullname, user.hashedPassword)
        })
        const finalSql = bulkInsertUserSql + valuesSqlString + returningInsetedUsersSql
        const insertedUsers = await this.transactionalSql.query(finalSql, sqlParams, userSchema)
        return insertedUsers
    }
}