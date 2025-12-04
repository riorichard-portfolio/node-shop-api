import { Pool } from 'pg';

import { IPostgreConfig } from '../../.domains/.shared.domain/config';

export default class PostgreDatabase {
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