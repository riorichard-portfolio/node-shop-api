import { TRepositoryResults } from '../.shared.domain/types'
import { IUserEntity } from './user.entity'

export interface IFindByEmailData {
    email(): string
}

export interface IUserQueryRepository {
    findByEmail(data: IFindByEmailData): Promise<TRepositoryResults<IUserEntity>>
}