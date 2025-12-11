import AppInfrastructure from './app.infra'
import AppEventPublisher from './app.event.publisher'
import AppRepositories from './app.repositories'

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