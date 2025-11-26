import crypto from 'crypto'

import {
    CreateNewUserData,
    CreateNewUserFailed,
    CreateNewUserOk,
    FindUserByEmailData,
    FindUserByEmailFailed,
    FindUserByEmailOk,
    UserService as UserSrvc
} from "../domains/user.domain/user.service.domain";

import { UserEventPublisher } from "../domains/user.domain/user.event.domain";
import { UserQueryRepository } from "../domains/user.domain/user.repository.domain";
import { ServiceResult } from "../domains/.shared.domain/types";
import { BcryptHasher } from '../domains/.shared.domain/bcrypt';

export default class UserService implements UserSrvc {
    constructor(
        private readonly publisher: UserEventPublisher,
        private readonly repository: UserQueryRepository,
        private readonly bcryptHasher: BcryptHasher
    ) { }

    private generateUserId(): string {
        return crypto.randomUUID()
    }

    public async findUserByEmail(data: FindUserByEmailData): Promise<ServiceResult<FindUserByEmailOk, FindUserByEmailFailed>> {
        const user = await this.repository.findByEmail(data)
        if (!user.found) {
            return {
                ok: false,
                failDetail: {
                    type: 'USER_NOT_EXIST',
                    email: data.email()
                }
            }
        }
        return {
            ok: true,
            data() {
                return {
                    email() { return user.data().email() },
                    fullname() { return user.data().fullname() },
                    hashedPassword() { return user.data().hashedPassword() },
                    userId() { return user.data().userId() },
                }
            },
        }
    }

    public async createNewUser(data: CreateNewUserData): Promise<ServiceResult<CreateNewUserOk, CreateNewUserFailed>> {
        const user = await this.repository.findByEmail(data)
        if (user.found) {
            return {
                ok: false,
                failDetail: {
                    type: 'EMAIL_EXIST',
                    email: data.email()
                }
            }
        }
        const newUserId = this.generateUserId()
        const hashedPassword = await this.bcryptHasher.bcryptHash(data.password())
        await this.publisher.publishUserRegistered({
            email: data.email(),
            fullName: data.fullname(),
            hashedPassword,
            userId: newUserId
        })
        return {
            ok: true,
            data() {
                return {
                    userId() {
                        return newUserId
                    },
                }
            },
        }
    }
}