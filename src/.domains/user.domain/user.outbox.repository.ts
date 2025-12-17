export interface IUserToSync {
    userId: string
    email?: string
    hashedPassword?: string
    fullname?: string
}

export interface IUserSyncDBOutboxCommandRepository {
    bulkInsertUserToSync(syncData: IUserToSync[]): Promise<void>
}