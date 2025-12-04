import AppInfrastructure from './app.infra.ts'
import AppEventPublisher from './app.event.publisher.ts'
import AppRepositories from './app.repositories.ts'
import AppServices from './app.services.ts'
import AppFactories from './app.factories.ts'
import AppEnvConfig from "./app.env.config.ts";

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