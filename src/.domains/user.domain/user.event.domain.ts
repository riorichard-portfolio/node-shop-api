export interface IUserToCreate {
    userId: string
    email: string
    hashedPassword: string
    fullname: string
}

export interface IUserToSync extends IUserToCreate { }

export interface IUserEventPublisher {
    publishUserRegistered(data: IUserToCreate): Promise<void>
}

export interface IUserEventCommandRepository {
    bulkInsertUser(users: IUserToCreate[]): Promise<IUserToSync[]>
}

export interface IUserSyncDBOutboxRepository {
    bulkInsertUserToSync(syncData: IUserToSync[]): Promise<void>
}