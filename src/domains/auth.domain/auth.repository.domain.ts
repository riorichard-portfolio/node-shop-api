import { RepositoryResult } from '../.shared.domain/types'
import { SessionEntity } from './session.entity'

export interface FindBySessionIdData {
    sessionId(): string
}

export interface AuthQueryRepository {
    findBySessionId(data: FindBySessionIdData): Promise<RepositoryResult<SessionEntity>>
}