import { TRepositoryResults } from '../.shared.domain/types'
import { ISessionEntity } from './session.entity'

export interface IFindBySessionIdData {
    sessionId(): string
}

export interface IAuthQueryRepository {
    findBySessionId(data: IFindBySessionIdData): Promise<TRepositoryResults<ISessionEntity>>
}