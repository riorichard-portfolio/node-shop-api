import AppInfrastructure from './app.infra.ts'
import AppEventPublisher from './app.event.publisher.ts'
import AppRepositories from './app.repositories.ts'

import UserService from '../../services/user.service'

export default class AppServices {
    private readonly userServiceValue: UserService

    constructor(
        appInfra: AppInfrastructure,
        appEventPublisher: AppEventPublisher,
        appRepositories: AppRepositories
    ) {
        this.userServiceValue = new UserService(
            appInfra.bcrypt(),
            appInfra.applicationResultFactory(),
            appEventPublisher.userEventPublisher(),
            appRepositories.userQueryRepository()
        )
    }

    public userService() {
        return this.userServiceValue
    }

}