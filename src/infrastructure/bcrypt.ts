import bcrypt from 'bcrypt'

import { BcryptHasher, BcryptVerifier, HashedString, } from '../domains/.shared.domain/bcrypt'

export default class Bcrypt implements BcryptHasher, BcryptVerifier {
    private readonly hashRounds: number
    constructor(hashRounds: number) {
        this.hashRounds = hashRounds
    }

    public async bcryptHash(stringData: string): Promise<HashedString> {
        const hashedString = await bcrypt.hash(stringData, this.hashRounds)
        return {
            value() {
                return hashedString
            }
        }
    }

    public bcryptVerify(stringToCompare: string, hashsedString: string): Promise<boolean> {
        return bcrypt.compare(stringToCompare, hashsedString)
    }
}