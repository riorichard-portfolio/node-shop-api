export interface AuthQueryRepository {
    isSessionValid(sessionId: string): Promise<boolean>
}