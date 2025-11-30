import { IApplicationResultFactory } from "../.domains/.shared.domain/result.factory";
import { ISuccessResult, IFailedResult } from "../.domains/.shared.domain/types";
import SuccessResult from "./application.results/success.result";
import FailedResult from "./application.results/failed.result";

export default class ApplicationResultFactory implements IApplicationResultFactory {
    public createSuccessResult<ResultData>(resultData: ResultData): ISuccessResult<ResultData> {
        return new SuccessResult(resultData)
    }

    public createFailedResult<FailedType>(failedType: FailedType): IFailedResult<FailedType> {
        return new FailedResult(failedType)
    }
}