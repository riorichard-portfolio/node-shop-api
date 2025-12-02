import PostgreDatabase from './.base.postgre'

import {
    TParam,
    ISqlCommandDB
} from '../../.domains/.shared.domain/sql.db'

import { IPostgreConfig } from '../../.domains/.shared.domain/config';

export default class CommandPostgre extends PostgreDatabase implements ISqlCommandDB {
    constructor(config: IPostgreConfig) {
        super(config)
    }
    
    public async command(sql: string, params: TParam[] = []): Promise<void> {
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
}