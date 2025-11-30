import {
    ILoginOutputDTO,
    IRefreshTokenOutputDTO
} from "../../domains/auth.domain/auth.output.dto"

import {
    IAuthOutputDTOFactory
} from "../../domains/auth.domain/auth.factories"

class LoginOutputDTO implements ILoginOutputDTO {
    constructor(
        private readonly dtoAccessToken: string,
        private readonly dtoRefreshToken: string
    ) { }
    public accessToken(): string {
        return this.dtoAccessToken
    }

    public refreshToken(): string {
        return this.dtoRefreshToken
    }
}

class RefreshTokenOutputDTO implements IRefreshTokenOutputDTO {
    constructor(
        private readonly dtoNewAccessToken: string
    ) { }
    public newAccessToken(): string {
        return this.dtoNewAccessToken
    }
}

export default class AuthOutputDTOFactory implements IAuthOutputDTOFactory {
    createLoginOutputDTO(accessToken: string, refreshToken: string): ILoginOutputDTO {
        return new LoginOutputDTO(accessToken, refreshToken)
    }
    createRefreshAccessTokenOutputDTO(newAccessToken: string): IRefreshTokenOutputDTO {
        return new RefreshTokenOutputDTO(newAccessToken)
    }
}