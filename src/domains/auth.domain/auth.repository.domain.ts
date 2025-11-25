import { RepositoryResult } from '../.shared.domain/types'

export type ValidSession = {
    isValid(): boolean
}

export interface ValidateSessionData {
    sessionId(): string
}

export interface AuthQueryRepository {
    validateSession(data: ValidateSessionData): Promise<RepositoryResult<ValidSession>>
}