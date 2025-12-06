import { IEventRegisteredUserInputDTO } from "./user.input.dto"

export interface IUserEventPublisher {
    publishUserRegistered(data: IEventRegisteredUserInputDTO): Promise<void>
}

export interface IUserEventCommandRepository {
    bulkInsertUser(users: IEventRegisteredUserInputDTO[]): Promise<void>
}