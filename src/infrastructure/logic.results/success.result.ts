import { ISuccessResult } from "../../domains/.shared.domain/types";

export default class SuccessResult<ResultData> implements ISuccessResult<ResultData> {
    constructor(
        private readonly dataForResult: ResultData
    ) { }

    public success(): true {
        return true
    }

    public data(): ResultData {
        return this.dataForResult
    }
}
