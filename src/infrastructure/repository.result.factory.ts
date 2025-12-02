import { IFoundRepositoryData, INotFoundRepositoryData } from '../.domains/.shared.domain/types'
import { IRepositoryResultFactory } from '../.domains/.shared.domain/result.factory'

class FoundRepositoryData<RepositoryData> implements IFoundRepositoryData<RepositoryData> {
    public readonly found = true
    constructor(
        private readonly repositoryData: RepositoryData
    ) { }
    public data(): RepositoryData {
        return this.repositoryData
    }
}

class NotFoundRepositoryData implements INotFoundRepositoryData {
    public readonly found = false
}

export default class RepositoryResultFactory implements IRepositoryResultFactory {
    public createFoundData<RepositoryData>(repositoryData: RepositoryData): IFoundRepositoryData<RepositoryData> {
        return new FoundRepositoryData(repositoryData)
    }
    public createNotFound(): INotFoundRepositoryData {
        return new NotFoundRepositoryData()
    }
}