import { IUserEventHandlerRepositories } from "../../.domains/user.domain/user.event";

import { ISqlTransaction } from "../../.domains/.shared.domain/sql.db";
import { ITransactionalRepositories } from "../../.domains/.shared.domain/transactional.repositories";
import { ITransactionQueries } from '../../.domains/.shared.domain/sql.db'

import UserEventCommandRepository from './user.command.repository'
import UserSyncDBOutboxCommandRepository from './sync.db.outbox.cmd.repo'

class UserEventHandlerRepositories implements IUserEventHandlerRepositories {
    constructor(
        private readonly transactionQueries: ITransactionQueries
    ) { }

    public userEventCommandRepository() {
        return new UserEventCommandRepository(this.transactionQueries)
    }

    public userOutboxSyncDBCommandRepository() {
        return new UserSyncDBOutboxCommandRepository(this.transactionQueries)
    }
}

export default class UserTransactionalRepositories implements ITransactionalRepositories<IUserEventHandlerRepositories> {
    constructor(
        private readonly sqlDb: ISqlTransaction
    ) { }

    public async transaction(process: (repositories: IUserEventHandlerRepositories) => Promise<void>): Promise<void> {
        await this.sqlDb.sqlTransaction(async (sqlTransaction) => {
            const userEventHandlerRepositories = new UserEventHandlerRepositories(sqlTransaction)
            await process(userEventHandlerRepositories)
        })
    }
}