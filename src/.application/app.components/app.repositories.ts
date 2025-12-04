import AppInfrastructure from './app.infra.ts'
import AppFactories from './app.factories.ts'

import AuthQueryRepository from '../../repositories/auth/auth.query.repository.ts'
import AuthEventCommandRepository from '../../repositories/auth/auth.command.repository.ts'
import UserQueryRepository from '../../repositories/user/user.query.repository.ts'
import UserEventCommandRepository from '../../repositories/user/user.command.repository.ts'

export default class AppRepositories {
    private readonly authQueryRepositoryValue: AuthQueryRepository
    private readonly authEventCommandRepositoryValue: AuthEventCommandRepository
    private readonly userQueryRepositoryValue: UserQueryRepository
    private readonly userEventCommandRepositoryValue: UserEventCommandRepository

    constructor(
        appInfra: AppInfrastructure,
        appFactories: AppFactories
    ) {
        this.authQueryRepositoryValue = new AuthQueryRepository(
            appInfra.queryPostgre(),
            appInfra.repositoryResultFactory(),
            appFactories.authEntitiesFactory()
        )
        this.authEventCommandRepositoryValue = new AuthEventCommandRepository(
            appInfra.commandPostgre()
        )
        this.userQueryRepositoryValue = new UserQueryRepository(
            appInfra.queryPostgre(),
            appInfra.repositoryResultFactory(),
            appFactories.userEntitiesFactory()
        )
        this.userEventCommandRepositoryValue = new UserEventCommandRepository(
            appInfra.commandPostgre()
        )
    }

    public authQueryRepository() {
        return this.authQueryRepositoryValue
    }

    public authEventCommandRepository() {
        return this.authEventCommandRepositoryValue
    }

    public userQueryRepository() {
        return this.userQueryRepositoryValue
    }

    public userEventCommandRepository() {
        return this.userEventCommandRepositoryValue
    }
}