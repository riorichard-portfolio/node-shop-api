export interface ISuccessResult<ResultData> {
    success: true
    data(): ResultData
}

export interface IFailedResult<FailedType> {
    success: false
    failedType(): FailedType
}

export type TApplicationResults<ResultData, FailedType> =
    | ISuccessResult<ResultData>
    | IFailedResult<FailedType>

export interface IFoundRepositoryData<RepositoryData> {
    found: true
    data(): RepositoryData
}

export interface INotFoundRepositoryData {
    found: false
}

export type TRepositoryResults<RepositoryData> =
    | IFoundRepositoryData<RepositoryData>
    | INotFoundRepositoryData
