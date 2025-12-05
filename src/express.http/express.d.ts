import { Request } from 'express';
import {
    IAccessTokenPayload,
    IRefreshTokenPayload
} from 'src/.domains/auth.domain/auth.token.management';

declare global {
    namespace Express {
        interface Request {
            authorizedAccessPayload?: IAccessTokenPayload
            authorizedRefreshPayload?: IRefreshTokenPayload
        }
    }
}