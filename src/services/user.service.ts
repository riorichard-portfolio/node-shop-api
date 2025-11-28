import crypto from 'crypto'

import {
    ICreateNewUserData,
    TCreateNewUserFailed,
    TCreateNewUserOk,
    IFindUserByEmailData,
    TFindUserByEmailFailed,
    TFindUserByEmailOk,
    IUserService
} from "../domains/user.domain/user.service.domain";

import { IUserEventPublisher } from "../domains/user.domain/user.event.domain";
import { IUserQueryRepository } from "../domains/user.domain/user.repository.domain";
import { TApplicationResults } from "../domains/.shared.domain/types";
import { IBcryptHasher } from '../domains/.shared.domain/bcrypt';

export default class UserService implements IUserService {
    constructor(
        private readonly publisher: IUserEventPublisher,
        private readonly repository: IUserQueryRepository,
        private readonly bcryptHasher: IBcryptHasher
    ) { }

    private generateUserId(): string {
        return crypto.randomUUID()
    }

    public async findUserByEmail(data: IFindUserByEmailData): Promise<TApplicationResults<TFindUserByEmailOk, TFindUserByEmailFailed>> {
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

    public async createNewUser(data: ICreateNewUserData): Promise<ServiceResult<TCreateNewUserOk, TCreateNewUserFailed>> {
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