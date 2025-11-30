import { IUserEventCommandRepository , IUserToCreate } from "../../domains/user.domain/user.event.domain";

import { ISqlCommandDB } from "../../domains/.shared.domain/sql.db";

const bulkInsertUserSql = `insert into users (user_id, email,fullname, hashed_password) values`

export default class UserEventCommandRepository implements IUserEventCommandRepository {
    constructor(
        private readonly sqlDb: ISqlCommandDB
    ) { }

    public async bulkInsertUser(users: IUserToCreate[]): Promise<void> {
        const sqlParams: Parameters<ISqlCommandDB['command']>[1] = []
        let valuesSqlString: string = ''
        users.forEach((user, index) => {
            valuesSqlString += `($${index * 4 + 1},$${(index * 4) + 2},$${(index * 4) + 3},$${(index * 4) + 4}) ${index != users.length - 1 ? ',' : ''}`
            sqlParams.push(user.userId, user.email, user.fullname, user.hashedPassword)
        })
        const finalSql = bulkInsertUserSql + valuesSqlString
        await this.sqlDb.command(finalSql, sqlParams)
    }
}