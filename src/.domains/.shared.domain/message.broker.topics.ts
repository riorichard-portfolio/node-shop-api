export interface IAuthMQTopics {
    sessionCreatedTopic(): string
}

export interface IUserMQTopics {
    userRegisteredTopic(): string
}