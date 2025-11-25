import { RepositoryResult } from '../.shared.domain/types'
import { UserEntity } from './user.entity'

export interface FindByEmailData {
    email(): string
}

export interface UserQueryRepository {
    findByEmail(data: FindByEmailData): Promise<RepositoryResult<UserEntity>>
}