export interface IUserToSync {
    userId: string
    email?: string
    hashedPassword?: string
    fullname?: string
}

export interface IUserSyncDBOutboxRepository {
    bulkInsertUserToSync(syncData: IUserToSync[]): Promise<void>
}