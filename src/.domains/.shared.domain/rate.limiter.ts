export interface IUserRateLimiter {
    hasExceededLimit(userId: string): Promise<boolean>
}