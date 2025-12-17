import AppInfrastructure from './app.infra'

import AuthEventCommandRepository from '../../repositories/auth/auth.command.repository'
import AuthSyncDBOutboxCommandRepository from '../../repositories/auth/sync.db.outbox.cmd.repo'

import UserEventCommandRepository from '../../repositories/user/user.command.repository'
import UserSyncDBOutboxCommandRepository from '../../repositories/user/sync.db.outbox.cmd.repo'


export default class AppTransactionalRepositories {
    constructor(
        private readonly appInfra: AppInfrastructure
    ) { }

    public async transaction(process: (transactionalRepositories: {
        userOutboxSyncDBCommandRepository(): UserSyncDBOutboxCommandRepository;
        userCommandRepository(): UserEventCommandRepository;
        authOutboxSyncDBCommandRepository(): AuthSyncDBOutboxCommandRepository;
        authCommandRepository(): AuthEventCommandRepository;
    }) => Promise<void>): Promise<void> {
        await this.appInfra.commandPostgre().sqlTransaction(async (transaction) => {
            // Define and instantiate the anonymous class in one step
            const repositories = new class {
                constructor(private trx: typeof transaction) { }

                userOutboxSyncDBCommandRepository = (): UserSyncDBOutboxCommandRepository =>
                    new UserSyncDBOutboxCommandRepository(this.trx);

                userCommandRepository = (): UserEventCommandRepository =>
                    new UserEventCommandRepository(this.trx);

                authOutboxSyncDBCommandRepository = (): AuthSyncDBOutboxCommandRepository =>
                    new AuthSyncDBOutboxCommandRepository(this.trx);

                authCommandRepository = (): AuthEventCommandRepository =>
                    new AuthEventCommandRepository(this.trx);
            }(transaction);

            await process(repositories);
        })
    }
}