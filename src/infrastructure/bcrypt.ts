import bcrypt from 'bcrypt'

import { IBcryptHasher, IBcryptVerifier } from '../.domains/.shared.domain/bcrypt'
import { IBcryptConfig } from '../.domains/.shared.domain/config'

export default class Bcrypt implements IBcryptHasher, IBcryptVerifier {
    constructor(
        private readonly config: IBcryptConfig
    ) { }

    public async bcryptHash(stringData: string): Promise<string> {
        const hashedString = await bcrypt.hash(stringData, this.config.saltRounds())
        return hashedString
    }

    public bcryptVerify(stringToCompare: string, hashsedString: string): Promise<boolean> {
        return bcrypt.compare(stringToCompare, hashsedString)
    }
}