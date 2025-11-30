import { ISuccessResult } from "../../.domains/.shared.domain/types";

export default class SuccessResult<ResultData> implements ISuccessResult<ResultData> {
    public readonly success = true
    constructor(
        private readonly dataForResult: ResultData
    ) { }

    public data(): ResultData {
        return this.dataForResult
    }
}
