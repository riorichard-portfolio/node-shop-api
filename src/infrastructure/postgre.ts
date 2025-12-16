import { Pool, PoolClient } from 'pg';

import { IPostgreConfig } from '../.domains/.shared.domain/config';
import {
    TParam,
    IQuerySchema,
    TSchemaToType,
    ISqlDB,
    ISqlQuery
} from '../.domains/.shared.domain/sql.db'

class TransactionQueries implements ISqlQuery {
    constructor(
        private readonly poolClient: PoolClient
    ) { }

    // Overload signatures
    public async query(sql: string, params: TParam[]): Promise<null>;
    public async query<const QuerySchema extends IQuerySchema>(
        sql: string,
        params: TParam[],
        schema: QuerySchema
    ): Promise<TSchemaToType<QuerySchema>[]>;
    public async query<const QuerySchema extends IQuerySchema>(
        sql: string,
        params: TParam[],
        schema?: QuerySchema): Promise<null | TSchemaToType<QuerySchema>[]> {
        const queryResult = await this.poolClient.query({
            text: sql,
            values: params
        });
        if (schema == undefined) return null
        const firstRow = queryResult.rows[0]
        if (firstRow != undefined) {
            for (const [rowColumn, rowColumnType] of Object.entries(schema)) {
                if (typeof firstRow[rowColumn] !== rowColumnType) {
                    throw new Error(`invalid column: column type ${rowColumn} not match with ${rowColumnType} in schema ${schema}`)
                }
            }
        }
        return queryResult.rows
    }

    public createSqlParams(): TParam[] {
        return []
    }

}

export default class Postgre implements ISqlDB {
    protected readonly pool: Pool;

    constructor(config: IPostgreConfig) {
        this.pool = new Pool({
            host: config.host(),
            port: config.port(),
            database: config.databaseName(),
            user: config.username(),
            password: config.password(),
            max: config.maxPool()
        });
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.pool.on('error', (err) => {
            console.error('❌ PostgreSQL pool error:', err);
            throw err
        });
        this.pool.on('connect', () => {
            console.log('✅ New client connected to pool');
        });

        this.pool.on('remove', () => {
            console.log('✅ Client removed from pool');
        });
    }

    public async isHealthy(): Promise<boolean> {
        const client = await this.pool.connect();
        try {
            await client.query('SELECT 1');
            return true;
        } catch (error) {
            console.error(error)
            return false;
        } finally {
            client.release();
        }
    }

    public async close(): Promise<void> {
        try {
            await this.pool.end();
            console.log('✅ PostgreSQL pool closed');
        } catch (error) {
            console.error('❌ Error closing PostgreSQL pool:', error);
            throw error;
        }
    }

    // Overload signatures
    public async query(sql: string, params: TParam[]): Promise<null>;
    public async query<const QuerySchema extends IQuerySchema>(
        sql: string,
        params: TParam[],
        schema: QuerySchema
    ): Promise<TSchemaToType<QuerySchema>[]>;
    public async query<const QuerySchema extends IQuerySchema>(
        sql: string,
        params: TParam[],
        schema?: QuerySchema): Promise<null | TSchemaToType<QuerySchema>[]> {
        const client = await this.pool.connect();
        try {
            const queryResult = await client.query({
                text: sql,
                values: params
            });
            if (schema == undefined) return null
            const firstRow = queryResult.rows[0]
            if (firstRow != undefined) {
                for (const [rowColumn, rowColumnType] of Object.entries(schema)) {
                    if (typeof firstRow[rowColumn] !== rowColumnType) {
                        throw new Error(`invalid column: column type ${rowColumn} not match with ${rowColumnType} in schema ${schema}`)
                    }
                }
            }
            return queryResult.rows
        } finally {
            client.release();
        }
    }

    public async sqlTransaction(executeQueries: (transactionQueries: ISqlQuery) => Promise<void>): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('begin')
            const transactionQueries = new TransactionQueries(client)
            await executeQueries(transactionQueries)
            await client.query('commit')
        } catch (error) {
            await client.query('rollback')
            if (error instanceof Error) throw new Error(`invalid transaction operation with error: ${error.message}`)
            throw new Error(`invalid transaction operation with unknown error: \n${error}`)
        } finally {
            client.release();
        }
    }

    public createSqlParams(): TParam[] {
        return []
    }
}