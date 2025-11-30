export interface IBcryptHasher {
    bcryptHash(stringData: string): Promise<string>
}

export interface IBcryptVerifier {
    bcryptVerify(stringToCompare: string, hashsedString: string): Promise<boolean>
}