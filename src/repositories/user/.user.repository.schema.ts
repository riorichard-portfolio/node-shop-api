import { IQuerySchema } from "../../.domains/.shared.domain/sql.db";

export const userSchema = {
    userId: 'string',
    email: 'string',
    fullname: 'string',
    hashedPassword: 'string'
} as const satisfies IQuerySchema