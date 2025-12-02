import { IAuthUsecase } from "../.domains/auth.domain/auth.usecase.domain";
import { IAppConfig } from "../.domains/.shared.domain/config";

import PostgreDatabase from "../infrastructure/postgre";
import KafkaMQ from "../infrastructure/kafka";
import RedisCache from "../infrastructure/redis";
import AuthQueryRepository from "../repositories/auth/auth.query.repository";
import AuthEntitiesFactory from "../entity.factories/auth.entity.factory";
import UserEntitiesFactory from "../entity.factories/user.entity.factory";
import RepositoryResultFactory from "../infrastructure/repository.result.factory";
import UserQueryRepository from "../repositories/user/user.query.repository";
import AuthInputDTOFactory from "../dto.factories/auth/auth.input.dto.factory";
import AuthOutputDTOFactory from "../dto.factories/auth/auth.output.dto.factory";
import UserService from "../services/user.service";
import Bcrypt from "../infrastructure/bcrypt";
import UserEventPublisher from "../event.publishers/user.event.publisher";
import ApplicationResultFactory from "../infrastructure/application.results.factory";
import AuthUsecase from "../usecases/auth.usecase";
import AuthEventPublisher from "../event.publishers/auth.event.publisher";
import AuthJwt from "../infrastructure/jwt/auth.jwt";
import { IAuthInputDTOFactory } from "../.domains/auth.domain/auth.factories";
import { IAuthEventCommandRepository } from "../.domains/auth.domain/auth.event.domain";
import { IUserEventCommandRepository } from "../.domains/user.domain/user.event.domain";
import AuthEventCommandRepository from "../repositories/auth/auth.command.repository";
import UserEventCommandRepository from "../repositories/user/user.command.repository";

interface IAppContainer {
    authUsecase(): IAuthUsecase
    authInputDTOFactory(): IAuthInputDTOFactory
    authEventCommandRepository(): IAuthEventCommandRepository
    userEventCommandRepository(): IUserEventCommandRepository
}

export default class Container implements IAppContainer {
    private readonly authUsecaseValue: IAuthUsecase
    private readonly authInputDTOFactoryValue: IAuthInputDTOFactory
    private readonly authEventCommandRepositoryValue: IAuthEventCommandRepository
    private readonly userEventCommandRepositoryValue: IUserEventCommandRepository

    constructor(
        private readonly appConfig: IAppConfig
    ) {
        const infrastructures = this.initializeInfrastructures()
        const entitiesFactories = this.initializeEntityFactories()
        const dtoInputsFactories = this.initializeInputDTOFactories()
        const dtoOutputsFactories = this.initializeOutputDTOFactories()
        const bcrypt = this.initializeBcrypt()


        const authQueryRepo = new AuthQueryRepository(
            infrastructures.postgreDb,
            infrastructures.repoResultFactory,
            entitiesFactories.authEntityFactory
        )

        const userQueryRepo = new UserQueryRepository(
            infrastructures.postgreDb,
            infrastructures.repoResultFactory,
            entitiesFactories.userEntityFactory
        )

        const userEventPublisher = new UserEventPublisher(
            infrastructures.kafkaMq,
            this.appConfig.userMqTopics()
        )

        const authEventPublisher = new AuthEventPublisher(
            infrastructures.kafkaMq,
            this.appConfig.authMqTopics()
        )

        const userService = new UserService(
            bcrypt,
            infrastructures.applicationResultFactory,
            userEventPublisher,
            userQueryRepo
        )

        const authJwt = new AuthJwt(appConfig.authConfig())

        this.authUsecaseValue = new AuthUsecase(
            infrastructures.applicationResultFactory,
            userService,
            bcrypt,
            authEventPublisher,
            authQueryRepo,
            authJwt,
            dtoOutputsFactories.authOutputDTOFactory,
            this.appConfig.authConfig()
        )
        this.authInputDTOFactoryValue = dtoInputsFactories.authInputDTOFactory
        this.authEventCommandRepositoryValue = new AuthEventCommandRepository(
            infrastructures.postgreDb
        )
        this.userEventCommandRepositoryValue = new UserEventCommandRepository(
            infrastructures.postgreDb
        )
    }

    private async initializeInfrastructures() {
        // infrastructures
        const postgreDb = new PostgreDatabase(this.appConfig.postgreConfig())
        const kafkaMq = new KafkaMQ(this.appConfig.kafkaConfig())
        await kafkaMq.start()
        const redisCache = new RedisCache(this.appConfig.redisConfig())
        const repoResultFactory = new RepositoryResultFactory()
        const applicationResultFactory = new ApplicationResultFactory()

        return {
            postgreDb, kafkaMq, redisCache, repoResultFactory, applicationResultFactory
        }
    }

    private initializeEntityFactories() {
        // entity factories
        const authEntityFactory = new AuthEntitiesFactory()
        const userEntityFactory = new UserEntitiesFactory()

        return { authEntityFactory, userEntityFactory }
    }

    private initializeInputDTOFactories() {
        // input dto factories
        const authInputDTOFactory = new AuthInputDTOFactory()
        return { authInputDTOFactory }
    }

    private initializeOutputDTOFactories() {
        // output dto factories
        const authOutputDTOFactory = new AuthOutputDTOFactory()
        return { authOutputDTOFactory }
    }

    private initializeBcrypt() {
        const bcrypt = new Bcrypt(this.appConfig.bcryptConfig())
        return bcrypt
    }

    public authUsecase(): IAuthUsecase {
        return this.authUsecaseValue
    }

    public authInputDTOFactory(): IAuthInputDTOFactory {
        return this.authInputDTOFactoryValue
    }

    public authEventCommandRepository(): IAuthEventCommandRepository {
        return this.authEventCommandRepositoryValue
    }

    public userEventCommandRepository(): IUserEventCommandRepository {
        return this.userEventCommandRepositoryValue
    }

}