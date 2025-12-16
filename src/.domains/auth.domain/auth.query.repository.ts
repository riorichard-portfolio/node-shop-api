import { TRepositoryResults } from '../.shared.domain/types'
import { ISessionEntity } from './auth.entities'

export interface IFindBySessionIdData {
    sessionId(): string
}

export interface IAuthQueryRepository {
    findBySessionId(data: IFindBySessionIdData): Promise<TRepositoryResults<ISessionEntity>>
}