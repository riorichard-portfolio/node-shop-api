import { IAuthEventHandlerRepositories } from "../../.domains/auth.domain/auth.event";

import { ISqlTransaction } from "../../.domains/.shared.domain/sql.db";
import { ITransactionalRepositories } from "../../.domains/.shared.domain/transactional.repositories";
import { ITransactionQueries } from '../../.domains/.shared.domain/sql.db'

import AuthEventCommandRepository from './auth.command.repository'
import AuthSyncDBOutboxCommandRepository from './sync.db.outbox.cmd.repo'

class AuthEventHandlerRepositories implements IAuthEventHandlerRepositories {
    constructor(
        private readonly transactionQueries: ITransactionQueries
    ) { }

    public authEventCommandRepository() {
        return new AuthEventCommandRepository(this.transactionQueries)
    }

    public authOutboxSyncDBCommandRepository() {
        return new AuthSyncDBOutboxCommandRepository(this.transactionQueries)
    }
}

export default class AuthTransactionalRepositories implements ITransactionalRepositories<IAuthEventHandlerRepositories> {
    constructor(
        private readonly sqlDb: ISqlTransaction
    ) { }

    public async transaction(process: (repositories: IAuthEventHandlerRepositories) => Promise<void>): Promise<void> {
        await this.sqlDb.sqlTransaction(async (sqlTransaction) => {
            const authEventHandlerRepositories = new AuthEventHandlerRepositories(sqlTransaction)
            await process(authEventHandlerRepositories)
        })
    }
}