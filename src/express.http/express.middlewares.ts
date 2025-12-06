import { Request, Response, NextFunction } from "express";

import ExpressHandler from "./express.base.handler";
import { IAuthTokenVerifier } from "../.domains/auth.domain/auth.token.management";
import { IUserRateLimiter } from "../.domains/.shared.domain/rate.limiter";

const noAuthorizationError = 'unauthorized: no authorization in headers'
const invalidBearerAuthorizationError = 'unauthorized: authorization string not started with bearer in headers'
const emptyAuthorizationBearerError = 'unauthorized: empty bearer authorization in headers'
const noAuthorizedAccessPayloadError = 'invalid operation: access jwt middleware must used before accessing this middleware'
const exceededLimitError = 'unauthorized: user has reached limit request per second'

const bearerPrefix = 'Bearer '

export default class ExpressMiddlewares extends ExpressHandler {
    constructor(
        private readonly authTokenVerifier: IAuthTokenVerifier,
        private readonly userRateLimiter: IUserRateLimiter
    ) {
        super()
    }

    public accessJwtMiddleware = (request: Request, response: Response, next: NextFunction) => {
        const authorization = request.headers.authorization
        if (authorization == undefined) {
            return this.unauthorizedResponse(response, noAuthorizationError)
        }
        if (!authorization.startsWith(bearerPrefix)) {
            return this.unauthorizedResponse(response, invalidBearerAuthorizationError)
        }
        const accessToken = authorization.substring(bearerPrefix.length, authorization.length).trim()
        if (accessToken == "") {
            return this.unauthorizedResponse(response, emptyAuthorizationBearerError)
        }

        const result = this.authTokenVerifier.verifyAccessToken(accessToken)
        if (!result.success) {
            return this.unauthorizedResponse(response, result.reason())
        }
        request.authorizedAccessPayload = result
        return next()
    }

    public refreshJwtMiddleware = (request: Request, response: Response, next: NextFunction) => {
        const authorization = request.headers.authorization
        if (authorization == undefined) {
            return this.unauthorizedResponse(response, noAuthorizationError)
        }
        if (!authorization.startsWith(bearerPrefix)) {
            return this.unauthorizedResponse(response, invalidBearerAuthorizationError)
        }
        const refreshToken = authorization.substring(bearerPrefix.length, authorization.length).trim()
        if (refreshToken == "") {
            return this.unauthorizedResponse(response, emptyAuthorizationBearerError)
        }
        const result = this.authTokenVerifier.verifyRefreshToken(refreshToken)
        if (!result.success) {
            return this.unauthorizedResponse(response, result.reason())
        }
        request.authorizedRefreshPayload = result
        return next()
    }

    public userRateLimitMiddleware = async (request: Request, response: Response, next: NextFunction) => {
        if (request.authorizedAccessPayload == undefined) {
            throw new Error(noAuthorizedAccessPayloadError)
        }
        const userHasExceededLimit = await this.userRateLimiter.hasExceededLimit(
            request.authorizedAccessPayload.userId()
        )
        if (userHasExceededLimit) {
            return this.unauthorizedResponse(response, exceededLimitError)
        }
        return next()
    }

    public exceptionMiddleware = (
        error: Error,
        request: Request,
        response: Response,
        _: NextFunction
    ) => {
        console.error('🔥 INTERNAL ERROR:', {
            message: error.message,
            stack: error.stack,
            path: request.path,
            method: request.method,
            timestamp: new Date().toISOString()
        });

        return this.internalErrorResponse(response)
    }
}