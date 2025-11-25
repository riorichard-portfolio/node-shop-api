export type HashedString = {
    value(): string
}

export interface BcryptHasher {
    bcryptHash(stringData: string): Promise<HashedString>
}

export interface BcryptVerifier {
    bcryptVerify(stringToCompare: string, hashsedString: string): Promise<boolean>
}