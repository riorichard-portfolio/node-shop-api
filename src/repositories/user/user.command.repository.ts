import { UserEventCommandRepository as UserRepo, UserToCreate } from "../../domains/user.domain/user.event.domain";

import { SqlCommandDB } from "../../domains/.shared.domain/sql.db";

const bulkInsertUserSql = `insert into users (user_id, email,fullname, hashed_password) values`

export default class UserEventCommandRepository implements UserRepo {
    constructor(
        private readonly sqlDb: SqlCommandDB
    ) { }

    public async bulkInsertUser(users: UserToCreate[]): Promise<void> {
        const sqlParams: Parameters<SqlCommandDB['command']>[1] = []
        let valuesSqlString: string = ''
        users.forEach((user, index) => {
            valuesSqlString += `($${index * 4 + 1},$${(index * 4) + 2},$${(index * 4) + 3},$${(index * 4) + 4}) ${index != users.length - 1 ? ',' : ''}`
            sqlParams.push(user.userId, user.email, user.fullName, user.hashedPassword)
        })
        const finalSql = bulkInsertUserSql + valuesSqlString
        await this.sqlDb.command(finalSql, sqlParams)
    }
}