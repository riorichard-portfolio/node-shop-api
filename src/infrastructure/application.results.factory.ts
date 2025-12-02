import { IApplicationResultFactory } from "../.domains/.shared.domain/result.factory";
import { ISuccessResult, IFailedResult } from "../.domains/.shared.domain/types";

class FailedResult<FailedType> implements IFailedResult<FailedType> {
    public readonly success = false
    constructor(
        private readonly failType: FailedType
    ) { }

    public failedType(): FailedType {
        return this.failType
    }
}

class SuccessResult<ResultData> implements ISuccessResult<ResultData> {
    public readonly success = true
    constructor(
        private readonly dataForResult: ResultData
    ) { }

    public data(): ResultData {
        return this.dataForResult
    }
}

export default class ApplicationResultFactory implements IApplicationResultFactory {
    public createSuccessResult<ResultData>(resultData: ResultData): ISuccessResult<ResultData> {
        return new SuccessResult(resultData)
    }

    public createFailedResult<FailedType>(failedType: FailedType): IFailedResult<FailedType> {
        return new FailedResult(failedType)
    }
}