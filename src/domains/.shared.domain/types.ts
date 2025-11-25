export type ServiceResult<T, F> =
    | { ok: true; data(): T }
    | { ok: false; failDetail: F }

export type UsecaseResult<T, F> =
    | { success: true; data(): T }
    | { success: false; failDetail: F }

export type RepositoryResult<T> =
    | { found: true; data(): T }
    | { found: false }