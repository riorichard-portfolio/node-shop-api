export default interface IMemoryCache {
    incrementWithTTL(key: string, ttlSecond: number): Promise<number>
    setWithTTL(key: string, data: string | boolean | number | object, ttlSecond: number): Promise<void>
    get(key: string): Promise<string | null>
}