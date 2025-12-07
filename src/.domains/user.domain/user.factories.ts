import { IUserEntity } from "./user.entities";

export interface IUserEntitiesFactory {
    createUser(email: string, hashedPassword: string, fullname: string, userId: string): IUserEntity
}