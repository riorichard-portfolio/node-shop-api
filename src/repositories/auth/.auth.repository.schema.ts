import { IQuerySchema } from "../../.domains/.shared.domain/sql.db";

export const sessionSchema = {
    sessionId: 'string',
    userId: 'string',
    expiredAt: 'number'
} as const satisfies IQuerySchema