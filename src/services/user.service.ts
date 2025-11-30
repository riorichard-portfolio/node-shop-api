import crypto from 'crypto'

import {
    IUserService
} from "../.domains/user.domain/user.service.domain";
import { IApplicationResultFactory } from 'src/.domains/.shared.domain/result.factory';
import {
    ICreateNewUserInputDTO,
    IFindUserByEmailInputDTO
} from 'src/.domains/user.domain/user.input.dto';
import {
    IFindUserByEmailOutputDTO,
    TCreateNewUserFailedType,
    TFindUserByEmailFailedType
} from 'src/.domains/user.domain/user.output.dto';

import { IUserEventPublisher } from "../.domains/user.domain/user.event.domain";
import { IUserQueryRepository } from "../.domains/user.domain/user.repository.domain";
import { TApplicationResults } from "../.domains/.shared.domain/types";
import { IBcryptHasher } from '../.domains/.shared.domain/bcrypt';


export default class UserService implements IUserService {
    constructor(
        private readonly bcryptHasher: IBcryptHasher,
        private readonly resultFactory: IApplicationResultFactory,

        private readonly publisher: IUserEventPublisher,
        private readonly repository: IUserQueryRepository
    ) { }

    private generateUserId(): string {
        return crypto.randomUUID()
    }

    public async findUserByEmail(data: IFindUserByEmailInputDTO): Promise<TApplicationResults<IFindUserByEmailOutputDTO, TFindUserByEmailFailedType>> {
        const user = await this.repository.findByEmail(data)
        if (!user.found) {
            return this.resultFactory.createFailedResult('USER_NOT_EXISTS')
        }
        return this.resultFactory.createSuccessResult(
            user.data()
        )

    }

    public async createNewUser(data: ICreateNewUserInputDTO): Promise<TApplicationResults<{}, TCreateNewUserFailedType>> {
        const user = await this.repository.findByEmail(data)
        if (user.found) {
            return this.resultFactory.createFailedResult('EMAIL_EXISTS')
        }
        const newUserId = this.generateUserId()
        const hashedPassword = await this.bcryptHasher.bcryptHash(data.password())
        await this.publisher.publishUserRegistered({
            email: data.email(),
            fullname: data.fullname(),
            hashedPassword,
            userId: newUserId
        })
        return this.resultFactory.createSuccessResult({})
    }
}