import {
    IFoundRepositoryData,
    INotFoundRepositoryData,
    ISuccessResult,
    IFailedResult
} from "./types"

export interface IRepositoryResultFactory {
    createFoundData<RepositoryData>(repositoryData: RepositoryData): IFoundRepositoryData<RepositoryData>
    createNotFound(): INotFoundRepositoryData
}

export interface IApplicationResultFactory {
    createSuccessResult<ResultData>(resultData: ResultData): ISuccessResult<ResultData>
    createFailedResult<FailedDetails>(failedDetails: FailedDetails): IFailedResult<FailedDetails>
}