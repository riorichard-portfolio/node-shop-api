import crypto from 'crypto'

import {
    AuthUsecase as AuthUsc,
    LoginData,
    LoginFailed,
    LoginSuccess,
    RefreshTokenData,
    RefreshTokenFailed,
    RefreshTokenSuccess,
    RegisterData,
    RegisterFailed
} from "../domains/auth.domain/auth.usecase.domain";

import { AuthEventPublisher } from "../domains/auth.domain/auth.event.domain";
import { AuthQueryRepository } from "../domains/auth.domain/auth.repository.domain";
import { JWTTokenGenerator } from "../domains/.shared.domain/json.web.token";
import { BcryptVerifier } from "../domains/.shared.domain/bcrypt";
import { UsecaseResult } from "../domains/.shared.domain/types";
import { UserService } from "../domains/user.domain/user.service.domain";

export default class AuthUsecase implements AuthUsc {
    private readonly msPerDay = 24 * 60 * 60 * 1000;
    constructor(
        private readonly publisher: AuthEventPublisher,
        private readonly repository: AuthQueryRepository,
        private readonly jwtAccessGenerator: JWTTokenGenerator,
        private readonly jwtRefreshGenerator: JWTTokenGenerator,
        private readonly bcryptVerifier: BcryptVerifier,
        private readonly userService: UserService,
        private readonly sessionExpiredDays: number
    ) { }

    private generateSessionId(): string {
        return crypto.randomUUID()
    }

    private generateExpiredAt(): number {
        return Date.now() + (this.sessionExpiredDays * this.msPerDay)
    }

    public async register(data: RegisterData): Promise<UsecaseResult<void, RegisterFailed>> {
        const createdUser = await this.userService.createNewUser(data)
        if (!createdUser.ok) {
            return {
                success: false,
                failDetail: {
                    type: 'EMAIL_EXIST',
                    email: data.email()
                }
            }
        }
        return {
            success: true,
            data() { },
        }
    }

    public async login(data: LoginData): Promise<UsecaseResult<LoginSuccess, LoginFailed>> {
        const foundUser = await this.userService.findUserByEmail(data)
        if (!foundUser.ok) {
            return {
                success: false,
                failDetail: {
                    email: data.email(),
                    type: 'INVALID_EMAIL'
                }
            }
        }
        const verfiedSuccess = await this.bcryptVerifier.bcryptVerify(
            data.password(),
            foundUser.data().hashedPassword()
        )
        if (!verfiedSuccess) {
            return {
                success: false,
                failDetail: {
                    type: 'INVALID_PASSWORD'
                }
            }
        }
        const newAccessToken = this.jwtAccessGenerator.generateJWT({
            userId: foundUser.data().userId(),
        })
        const newSessionId = this.generateSessionId()
        const newRefreshToken = this.jwtRefreshGenerator.generateJWT({
            sessionId: newSessionId,
        })
        await this.publisher.publishSessionCreated({
            userId: foundUser.data().userId(),
            sessionId: newSessionId,
            expiredAt: this.generateExpiredAt()
        })
        return {
            success: true,
            data() {
                return {
                    accessToken() {
                        return newAccessToken
                    },
                    refreshToken() {
                        return newRefreshToken
                    },
                }
            },
        }
    }

    public async refreshAccessToken(data: RefreshTokenData): Promise<UsecaseResult<RefreshTokenSuccess, RefreshTokenFailed>> {
        const session = await this.repository.findBySessionId(data)
        if (!session.found) {
            return {
                success: false,
                failDetail: {
                    type: 'INVALID_SESSION',
                    sessionId: data.sessionId()
                }
            }
        }
        if (session.data().isExpired()) {
            return {
                success: false,
                failDetail: {
                    type: 'EXPIRED_SESSION',
                    expiredAt: session.data().expiredAt()
                }
            }
        }
        const newAccessToken = this.jwtAccessGenerator.generateJWT({
            userId: session.data().userId(),
        })
        return {
            success: true,
            data() {
                return {
                    newToken() {
                        return newAccessToken
                    },
                }
            },
        }
    }
}