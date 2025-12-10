import AppInfrastructure from "./app.components/app.infra";
import AppEnvConfig from "./app.components/app.env.config";
import AppRepositories from "./app.components/app.repositories";

import AuthEventHandler from '../event.handlers/auth.event.handler'
import UserEventHandler from '../event.handlers/user.event.handler'

export default class AppKafkaConsumer {
    private readonly authEventHandler: AuthEventHandler
    private readonly userEventHandler: UserEventHandler

    constructor(
        private readonly appInfra: AppInfrastructure,
        private readonly appConfig: AppEnvConfig,
        appRepositories: AppRepositories
    ) {
        this.authEventHandler = new AuthEventHandler(
            appRepositories.authEventCommandRepository()
        )
        this.userEventHandler = new UserEventHandler(
            appRepositories.userEventCommandRepository()
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