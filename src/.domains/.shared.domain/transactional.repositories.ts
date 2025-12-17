export interface ITransactionalRepositories<CommandRepositoriesMap> {
    transaction(process: (repositories: CommandRepositoriesMap) => Promise<void>): Promise<void>
}