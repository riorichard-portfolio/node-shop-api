export interface UserToCreate {
    userId: string
    email: string
    hashedPassword: string
    fullName: string
}

export interface UserEventPublisher {
    publishUserRegistered(data: UserToCreate): Promise<void>
}

export interface UserEventCommandRepository {
    bulkInsertUser(users: UserToCreate[]): Promise<void>
}