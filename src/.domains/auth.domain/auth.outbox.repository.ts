export interface ISessionToSync {
    sessionId: string
    userId?: string
    expiredAt?: number
}

export interface IAuthSyncDBOutboxCommandRepository {
    bulkInsertSessionToSync(syncData: ISessionToSync[]): Promise<void>
}