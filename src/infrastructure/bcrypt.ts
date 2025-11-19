import bcrypt from 'bcrypt'

import { BcryptHasher, BcryptVerifier } from '../domains/.shared.domain/bcrypt'

export default class Bcrypt implements BcryptHasher, BcryptVerifier {
    private readonly hashRounds: number
    constructor(hashRounds: number) {
        this.hashRounds = hashRounds
    }

    public bcryptHash(stringData: string): Promise<string> {
        return bcrypt.hash(stringData, this.hashRounds)
    }

    public bcryptVerify(stringToCompare: string, hashsedString: string): Promise<boolean> {
        return bcrypt.compare(stringToCompare, hashsedString)
    }
}