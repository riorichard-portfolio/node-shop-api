export type TOutboxProcessingType = 'sync'
export interface IOutboxDataSchema {
    id: 'string',
    [key: string]: 'string' | 'number' | 'boolean'
}

export type TSchemaToType<T extends IOutboxDataSchema> = {
    [K in keyof T]:
    T[K] extends 'string' ? string :
    T[K] extends 'number' ? number :
    T[K] extends 'boolean' ? boolean :
    never
}

export interface IOutboxCommandRepository {
    bulkInsertSyncDBOutbox<SyncData extends Record<string, any>>(syncData: SyncData[]): Promise<void>
}

export type TOutboxStatus = 'success' | 'failed'
export interface IOutboxBulkUpdateStatusData {
    id: string
    status: TOutboxStatus
}

export interface IOutboxProcessingRepository {
    findUnprocessed<const OutboxDataSchema extends IOutboxDataSchema>(
        outboxType: TOutboxProcessingType,
        outboxSchema: OutboxDataSchema,
        quantity?: number
    ): Promise<TSchemaToType<OutboxDataSchema>[]>
    bulkUpdateStatus(updateData: IOutboxBulkUpdateStatusData[]): Promise<void>
}