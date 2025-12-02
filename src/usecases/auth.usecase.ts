import crypto from 'crypto'

import {
    IAuthUsecase,
} from "../.domains/auth.domain/auth.usecase.domain";
import {
    ILoginInputDTO,
    IRefreshTokenInputDTO,
    IRegisterInputDTO
} from '../.domains/auth.domain/auth.input.dto';
import {
    ILoginOutputDTO,
    IRefreshTokenOutputDTO,
    TLoginFailedType,
    TRefreshTokenFailedType,
    TRegisterFailedType
} from '../.domains/auth.domain/auth.output.dto';

import { IAuthEventPublisher } from "../.domains/auth.domain/auth.event.domain";
import { IAuthQueryRepository } from "../.domains/auth.domain/auth.repository.domain";
import { IBcryptVerifier } from "../.domains/.shared.domain/bcrypt";
import { TApplicationResults } from "../.domains/.shared.domain/types";
import { IUserService } from "../.domains/user.domain/user.service.domain";
import { IApplicationResultFactory } from '../.domains/.shared.domain/result.factory';
import { IAuthOutputDTOFactory } from '../.domains/auth.domain/auth.factories';
import { IAuthTokenCreator } from '../.domains/auth.domain/auth.token.management';
import { IAuthConfig } from '../.domains/.shared.domain/config';

export default class AuthUsecase implements IAuthUsecase {
    private readonly msPerDay = 24 * 60 * 60 * 1000;
    constructor(
        // outside auth domains
        private readonly resultFactory: IApplicationResultFactory,
        private readonly userService: IUserService,
        private readonly bcryptVerifier: IBcryptVerifier,

        private readonly publisher: IAuthEventPublisher,
        private readonly repository: IAuthQueryRepository,
        private readonly tokenCreator: IAuthTokenCreator,
        private readonly OutputDTOFactory: IAuthOutputDTOFactory,
        private readonly authConfig: IAuthConfig
    ) { }

    private generateSessionId(): string {
        return crypto.randomUUID()
    }

    private generateExpiredAt(): number {
        return Date.now() + (this.authConfig.sessionExpiredDays() * this.msPerDay)
    }

    public async register(data: IRegisterInputDTO): Promise<TApplicationResults<{}, TRegisterFailedType>> {
        const createdUser = await this.userService.createNewUser(data)
        if (!createdUser.success) {
            return createdUser // failed in userservice created user , same failed result dto , return instead
        }
        return this.resultFactory.createSuccessResult({})
    }

    public async login(data: ILoginInputDTO): Promise<TApplicationResults<ILoginOutputDTO, TLoginFailedType>> {
        const foundUser = await this.userService.findUserByEmail(data)
        if (!foundUser.success) {
            return this.resultFactory.createFailedResult('INVALID_EMAIL')
        }
        const verfiedSuccess = await this.bcryptVerifier.bcryptVerify(
            data.password(),
            foundUser.data().hashedPassword()
        )
        if (!verfiedSuccess) {
            return this.resultFactory.createFailedResult('INVALID_PASSWORD')
        }
        const newAccessToken = this.tokenCreator.createAccessToken(foundUser.data().userId())
        const newSessionId = this.generateSessionId()
        await this.publisher.publishSessionCreated({
            userId: foundUser.data().userId(),
            sessionId: newSessionId,
            expiredAt: this.generateExpiredAt()
        })
        const newRefreshToken = this.tokenCreator.createRefreshToken(newSessionId)
        return this.resultFactory.createSuccessResult(
            this.OutputDTOFactory.createLoginOutputDTO(newAccessToken, newRefreshToken)
        )
    }

    public async refreshAccessToken(data: IRefreshTokenInputDTO): Promise<TApplicationResults<IRefreshTokenOutputDTO, TRefreshTokenFailedType>> {
        const session = await this.repository.findBySessionId(data)
        if (!session.found) {
            return this.resultFactory.createFailedResult('INVALID_SESSION')
        }
        if (session.data().isExpired()) {
            return this.resultFactory.createFailedResult('EXPIRED_SESSION')
        }
        const newAccessToken = this.tokenCreator.createAccessToken(session.data().userId())
        return this.resultFactory.createSuccessResult(
            this.OutputDTOFactory.createRefreshAccessTokenOutputDTO(newAccessToken)
        )
    }
}