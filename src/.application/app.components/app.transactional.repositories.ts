import AppInfrastructure from './app.infra'

import AuthTransactionalRepositories from '../../repositories/auth/.auth.transactional.repositories'
import UserTransactionalRepositories from '../../repositories/user/.user.transactional.repositories'

export default class AppTransactionalRepositories {
    constructor(
        private readonly appInfra: AppInfrastructure
    ) { }

    public authTransactionalRepositories() {
        return new AuthTransactionalRepositories(this.appInfra.commandPostgre())
    }

    public userTransactionalRepositories() {
        return new UserTransactionalRepositories(this.appInfra.commandPostgre())
    }
}