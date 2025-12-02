import PostgreDatabase from './.base.postgre'

import {
    TParam,
    IQuerySchema,
    TSchemaToType,
    ISqlQueryDB
} from '../../.domains/.shared.domain/sql.db'

import { IPostgreConfig } from '../../.domains/.shared.domain/config';

export default class QueryPostgre extends PostgreDatabase implements ISqlQueryDB {
    constructor(config: IPostgreConfig) {
        super(config)
    }

    public async query<const T extends IQuerySchema>(sql: string, schema: T, params: TParam[] = []): Promise<TSchemaToType<T>[]> {
        const client = await this.pool.connect();
        try {
            const queryResult = await client.query({
                text: sql,
                values: [...params]
            });
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
}