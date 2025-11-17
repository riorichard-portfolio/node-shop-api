export interface AuthRepository {
    processSaveSession(sessionId:string,userId:string,expiredAt:number): Promise<void> // process session in login (publish)
    isSessionValid(sessionId: string): Promise<boolean>
}

export interface AuthConsumerRepository {
    /**
    * Bulk insert sessions dengan format: [sessionId, userId, expiredAt][]
    * @param sessions Array of [sessionId, userId, expiredAt]
    */
    bulkInsertSession(sessions: [string, string, number][]): Promise<void>
}