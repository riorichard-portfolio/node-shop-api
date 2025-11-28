import { IFailedResult } from "../../domains/.shared.domain/types";

export default class FailedResult<FailedDetails> implements IFailedResult<FailedDetails> {
    constructor(
        private readonly failedDetails: FailedDetails
    ) { }

    public success(): false {
        return false
    }

    public failDetails(): FailedDetails {
        return this.failedDetails
    }
}