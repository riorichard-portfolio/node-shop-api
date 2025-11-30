export interface IUserEntity {
    email(): string
    hashedPassword(): string
    fullname(): string
    userId(): string
}
