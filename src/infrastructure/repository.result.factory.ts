import { IFoundRepositoryData, INotFoundRepositoryData } from '../domains/.shared.domain/types'
import { IRepositoryResultFactory } from '../domains/.shared.domain/result.factory'
import FoundRepositoryData from './repository.results/found.repository.data'
import NotFoundRepositoryData from './repository.results/not.found.repository.data'

export default class RepositoryResultFactory implements IRepositoryResultFactory {
    public createFoundData<RepositoryData>(repositoryData: RepositoryData): IFoundRepositoryData<RepositoryData> {
        return new FoundRepositoryData(repositoryData)
    }
    public createNotFound(): INotFoundRepositoryData {
        return new NotFoundRepositoryData()
    }
}