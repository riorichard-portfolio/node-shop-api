import AppInfrastructure from "./app.components/app.infra";
import AppEnvConfig from "./app.components/app.env.config";
import AppTransactionalRepositories from './app.components/app.transactional.repositories'

import AuthEventHandler from '../event.handlers/auth.event.handler'
import UserEventHandler from '../event.handlers/user.event.handler'

export default class AppKafkaConsumer {
    private readonly authEventHandler: AuthEventHandler
    private readonly userEventHandler: UserEventHandler

    constructor(
        private readonly appInfra: AppInfrastructure,
        private readonly appConfig: AppEnvConfig,
        appTransactionalRepositories: AppTransactionalRepositories
    ) {
        this.authEventHandler = new AuthEventHandler(
            appTransactionalRepositories.authTransactionalRepositories()
        )
        this.userEventHandler = new UserEventHandler(
            appTransactionalRepositories.userTransactionalRepositories()
        )
        this.setupKafkaConsumer()
    }

    private setupAuthEventConsumer() {
        this.appInfra.kafka().on(
            this.appConfig.authMqTopics().sessionCreatedTopic(),
            this.authEventHandler.sessionCreated
        )
    }

    private setupUserEventConsumer() {
        this.appInfra.kafka().on(
            this.appConfig.userMqTopics().userRegisteredTopic(),
            this.userEventHandler.userRegistered
        )
    }

    private setupKafkaConsumer() {
        this.setupAuthEventConsumer()
        this.setupUserEventConsumer()
    }

    public async startConsumer() {
        await this.appInfra.kafka().startConsumer()
    }
}