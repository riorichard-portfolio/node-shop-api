import { Request, Response } from 'express'

import ExpressHandler from '../express.base.handler';

import { IAuthUsecase } from "../../.domains/auth.domain/auth.usecase.domain";
import { IAuthInputDTOFactory } from 'src/.domains/auth.domain/auth.factories';


const loginBodySchema = {
    email: 'email',
    password: 'string'
} as const

const registerBodySchema = {
    email: 'email',
    password: 'string',
    fullname: 'string'
} as const

const refreshTokenSchema = {
    sessionId: 'uuid'
} as const

export default class AuthHandler extends ExpressHandler {
    constructor(
        private readonly authInputDtoFactory: IAuthInputDTOFactory,
        private readonly authUsecase: IAuthUsecase
    ) {
        super()
    }

    public async login(request: Request, response: Response) {
        const validatedBody = this.safelyGetObject(request.body, loginBodySchema)
        if (!validatedBody.isValidData) {
            return this.invalidDataResponse(response, validatedBody.getInvalidKeysMessages())
        }
        const result = await this.authUsecase.login(
            this.authInputDtoFactory.createLoginInputDTO(
                validatedBody.validatedData().email,
                validatedBody.validatedData().password
            )
        )
        if (!result.success) {
            return this.unauthorizedResponse(response, result.failedType())
        }
        return this.successResponse(
            response,
            {
                access_token: result.data().accessToken(),
                refresh_token: result.data().refreshToken()
            }
        )
    }

    public async register(request: Request, response: Response) {
        const validatedBody = this.safelyGetObject(request.body, registerBodySchema)
        if (!validatedBody.isValidData) {
            return this.invalidDataResponse(response, validatedBody.getInvalidKeysMessages())
        }
        const result = await this.authUsecase.register(
            this.authInputDtoFactory.createRegisterInputDTO(
                validatedBody.validatedData().email,
                validatedBody.validatedData().password,
                validatedBody.validatedData().fullname
            )
        )
        if (!result.success) {
            return this.duplicationConstraintResponse(response, result.failedType())
        }
        return this.createdResponse(response)
    }

    public async refreshToken(request: Request, response: Response) {
        const validatedBody = this.safelyGetObject(request.body, refreshTokenSchema)
        if (!validatedBody.isValidData) {
            return this.invalidDataResponse(response, validatedBody.getInvalidKeysMessages())
        }
        const result = await this.authUsecase.refreshAccessToken(
            this.authInputDtoFactory.createRefreshTokenInputDTO(
                validatedBody.validatedData().sessionId
            )
        )
        if (!result.success) {
            return this.unauthorizedResponse(response, result.failedType())
        }
        return this.successResponse(
            response,
            {
                new_access_token: result.data().newAccessToken()
            }
        )
    }
}