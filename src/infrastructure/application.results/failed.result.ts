import { IFailedResult } from "../../.domains/.shared.domain/types";

export default class FailedResult<FailedType> implements IFailedResult<FailedType> {
    public readonly success = false
    constructor(
        private readonly failType: FailedType
    ) { }

    public failedType(): FailedType {
        return this.failType
    }
}