import AppInfrastructure from './app.infra'
import AppEventPublisher from './app.event.publisher'
import AppRepositories from './app.query.repositories'
import AppServices from './app.services'
import AppFactories from './app.factories'
import AppEnvConfig from "./app.env.config";

import AuthUsecase from '../../usecases/auth.usecase'

export default class AppUsecases {
    private readonly authUsecaseValue: AuthUsecase
    constructor(
        appInfra: AppInfrastructure,
        appEventPublisher: AppEventPublisher,
        appRepositories: AppRepositories,
        appServices: AppServices,
        appFactories: AppFactories,
        appConfig: AppEnvConfig
    ) {
        this.authUsecaseValue = new AuthUsecase(
            appInfra.applicationResultFactory(),
            appServices.userService(),
            appInfra.bcrypt(),
            appEventPublisher.authEventPublisher(),
            appRepositories.authQueryRepository(),
            appInfra.authJwt(),
            appFactories.authOutputDTOFactory(),
            appConfig.authConfig()
        )
    }

    public authUsecase() {
        return this.authUsecaseValue
    }
}