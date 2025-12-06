import { IUserEntity } from "./user.entities";
import { IEventRegisteredUserInputDTO } from "./user.input.dto";

export interface IUserEntitiesFactory {
    createUser(email: string, hashedPassword: string, fullname: string, userId: string): IUserEntity
}

export interface IUserEventInputDTOFactory {
    RegisteredUserInputDTO(userId: string, email: string, hashedPassword: string, fullname: string): IEventRegisteredUserInputDTO
}