import AppEnvConfig from "./app.env.config.ts";
import AppInfrastructure from "./app.infra.ts";

import AuthEventPublisher from '../../event.publishers/auth.event.publisher'
import UserEventPublisher from '../../event.publishers/user.event.publisher'

export default class AppEventPublisher {
    private readonly authEventPublisherValue: AuthEventPublisher
    private readonly userEventPublisherValue: UserEventPublisher

    constructor(
        appConfig: AppEnvConfig,
        appInfra: AppInfrastructure
    ) {
        this.authEventPublisherValue = new AuthEventPublisher(
            appInfra.kafka(),
            appConfig.authMqTopics()
        )
        this.userEventPublisherValue = new UserEventPublisher(
            appInfra.kafka(),
            appConfig.userMqTopics()
        )
    }

    public authEventPublisher() {
        return this.authEventPublisherValue
    }
    public userEventPublisher() {
        return this.userEventPublisherValue
    }
}
