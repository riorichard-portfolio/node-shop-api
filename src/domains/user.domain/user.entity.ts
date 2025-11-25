export interface UserEntity {
    email(): string
    hashedPassword(): string
    fullname(): string
    userId(): string
}

export default class User implements UserEntity {
    constructor(
        private readonly userEmail: string,
        private readonly userHashedPassword: string,
        private readonly userFullname: string,
        private readonly userUserId: string
    ) { }

    public email(): string { return this.userEmail }
    public fullname(): string { return this.userFullname }
    public hashedPassword(): string { return this.userHashedPassword }
    public userId(): string { return this.userUserId }
}