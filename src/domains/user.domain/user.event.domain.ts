export interface IUserToCreate {
    userId: string
    email: string
    hashedPassword: string
    fullname: string
}

export interface IUserEventPublisher {
    publishUserRegistered(data: IUserToCreate): Promise<void>
}

export interface IUserEventCommandRepository {
    bulkInsertUser(users: IUserToCreate[]): Promise<void>
}