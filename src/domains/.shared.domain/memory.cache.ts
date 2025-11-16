export default interface MemoryCache {
    incrementWithTTL(key: string, ttlSecond: number): Promise<number>
    setWithTTL<T>(key: string, data: T, ttlSecond: number): Promise<void>
    get(key: string): Promise<string | null>
}