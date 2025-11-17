import { Pool } from 'pg';

import SqlDb from '../domains/.shared.domain/sql.db'
import { TPostgreConfig } from '../config/config.instances/postgre.config';

export default class PostgreDatabase implements SqlDb {
    private readonly pool: Pool;

    constructor(config: TPostgreConfig) {
        this.pool = new Pool({
            host: config.PG_HOST,
            port: config.PG_PORT,
            database: config.PG_DATABASE,
            user: config.PG_USER,
            password: config.PG_PASSWORD,
            max: config.PG_MAX_POOL
        });
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.pool.on('error', (err) => {
            console.error('❌ PostgreSQL pool error:', err);
        });
        this.pool.on('connect', () => {
            console.log('✅ New client connected to pool');
        });

        this.pool.on('remove', () => {
            console.log('🔌 Client removed from pool');
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

    public async command(sql: string, params: string[] = []): Promise<void> {
        const client = await this.pool.connect();
        try {
            const doBlockSql = `
                DO $$
                BEGIN
                    ${sql}
                END;
                $$;
            `;

            await client.query({
                text: doBlockSql,
                values: [...params]
            });
        } finally {
            client.release();
        }
    }

    public async query(sql: string, params: string[] = []): Promise<unknown> {
        const client = await this.pool.connect();
        try {
            const result = await client.query({
                text: sql,
                values: [...params],
                rowMode: 'array'
            });
            return result.rows;
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
}