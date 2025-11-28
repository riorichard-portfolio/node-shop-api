export interface ISuccessResult<ResultData> {
    success(): true
    data(): ResultData
}

export interface IFailedResult<FailedDetails> {
    success(): false
    failDetails(): FailedDetails
}

export type TApplicationResults<ResultData, FailedDetails> =
    | ISuccessResult<ResultData>
    | IFailedResult<FailedDetails>

export interface IFoundRepositoryData<RepositoryData> {
    found(): true
    data(): RepositoryData
}

export interface INotFoundRepositoryData {
    found(): false
}

export type TRepositoryResults<RepositoryData> =
    | IFoundRepositoryData<RepositoryData>
    | INotFoundRepositoryData