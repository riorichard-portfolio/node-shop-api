import bcrypt from 'bcrypt'

import { BcryptHasher, BcryptVerifier } from '../domains/.shared.domain/bcrypt'

export default class Bcrypt implements BcryptHasher, BcryptVerifier {
    private readonly hashRounds: number
    constructor(hashRounds: number) {
        this.hashRounds = hashRounds
    }

    public async bcryptHash(stringData: string): Promise<string> {
        const hashedString = await bcrypt.hash(stringData, this.hashRounds)
        return hashedString
    }

    public bcryptVerify(stringToCompare: string, hashsedString: string): Promise<boolean> {
        return bcrypt.compare(stringToCompare, hashsedString)
    }
}