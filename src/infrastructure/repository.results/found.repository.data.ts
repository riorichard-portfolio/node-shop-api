import { IFoundRepositoryData } from "../../domains/.shared.domain/types";

export default class FoundRepositoryData<RepositoryData> implements IFoundRepositoryData <RepositoryData> {
    constructor(
        private readonly repositoryData: RepositoryData
    ) { }

    public found(): true {
        return true
    }

    public data(): RepositoryData {
        return this.repositoryData
    }
}