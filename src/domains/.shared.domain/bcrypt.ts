export interface BcryptHasher {
    bcryptHash(stringData: string): Promise<string>
}

export interface BcryptVerifier {
    bcryptVerify(stringToCompare: string, hashsedString: string): Promise<boolean>
}