import { IUserEntity } from "../.domains/user.domain/user.entities"
import { IUserEntitiesFactory } from "../.domains/user.domain/user.factories"

class User implements IUserEntity {
    constructor(
        private readonly userEmail: string,
        private readonly userHashedPassword: string,
        private readonly userFullname: string,
        private readonly userUserId: string
    ) { }

    public email(): string { return this.userEmail }
    public fullname(): string { return this.userFullname }
    public hashedPassword(): string { return this.userHashedPassword }
    public userId(): string { return this.userUserId }
}

export default class UserEntitiesFactory implements IUserEntitiesFactory {
    public createUser(email: string, hashedPassword: string, fullname: string, userId: string): IUserEntity {
        return new User(email, hashedPassword, fullname, userId)
    }
}