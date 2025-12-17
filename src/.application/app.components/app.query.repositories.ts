import AppInfrastructure from './app.infra'
import AppFactories from './app.factories'

import AuthQueryRepository from '../../repositories/auth/auth.query.repository'
import UserQueryRepository from '../../repositories/user/user.query.repository'

export default class AppQueryRepositories {
    private readonly authQueryRepositoryValue: AuthQueryRepository
    private readonly userQueryRepositoryValue: UserQueryRepository

    constructor(
        appInfra: AppInfrastructure,
        appFactories: AppFactories
    ) {
        this.authQueryRepositoryValue = new AuthQueryRepository(
            appInfra.queryPostgre(),
            appInfra.repositoryResultFactory(),
            appFactories.authEntitiesFactory()
        )
        this.userQueryRepositoryValue = new UserQueryRepository(
            appInfra.queryPostgre(),
            appInfra.repositoryResultFactory(),
            appFactories.userEntitiesFactory()
        )
    }

    public authQueryRepository() {
        return this.authQueryRepositoryValue
    }


    public userQueryRepository() {
        return this.userQueryRepositoryValue
    }

}