import { IFoundRepositoryData } from "../../.domains/.shared.domain/types";

export default class FoundRepositoryData<RepositoryData> implements IFoundRepositoryData<RepositoryData> {
    public readonly found = true
    constructor(
        private readonly repositoryData: RepositoryData
    ) { }
    public data(): RepositoryData {
        return this.repositoryData
    }
}