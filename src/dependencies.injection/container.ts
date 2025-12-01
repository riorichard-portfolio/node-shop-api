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
import AuthInputDTOFactory from "src/dto.factories/auth/auth.input.dto.factory";
import AuthOutputDTOFactory from "src/dto.factories/auth/auth.output.dto.factory";
import UserService from "src/services/user.service";
import Bcrypt from "src/infrastructure/bcrypt";
import UserEventPublisher from "src/event.publishers/user.event.publisher";

interface IAppContainer {
    authUsecase(): IAuthUsecase
}

export default class Container implements IAppContainer {
    private readonly authUsecaseValue: IAuthUsecase

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

        const userEventPublisher = new UserEventPublisher()

        const userService = new UserService(
            bcrypt,
            infrastructures.repoResultFactory,

        )

        const authUsecase = ne
    }

    private initializeInfrastructures() {
        // infrastructures
        const postgreDb = new PostgreDatabase(this.appConfig.postgreConfig())
        const kafkaMq = new KafkaMQ(this.appConfig.kafkaConfig())
        const redisCache = new RedisCache(this.appConfig.redisConfig())
        const repoResultFactory = new RepositoryResultFactory()

        return {
            postgreDb, kafkaMq, redisCache, repoResultFactory
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
        return { bcrypt }
    }

}