import {
    ILoginInputDTO,
    IRefreshTokenInputDTO,
    IRegisterInputDTO
} from "../../domains/auth.domain/auth.input.dto";

import {
    IAuthInputDTOFactory
} from "../../domains/auth.domain/auth.factories"

class LoginInputDTO implements ILoginInputDTO {
    constructor(
        private readonly dtoEmail: string,
        private readonly dtoPassword: string
    ) { }

    public email(): string {
        return this.dtoEmail
    }
    public password(): string {
        return this.dtoPassword
    }
}

class RefreshTokenInputDTO implements IRefreshTokenInputDTO {
    constructor(
        private readonly dtoSessionId: string
    ) { }
    public sessionId(): string {
        return this.dtoSessionId
    }
}

class RegisterInputDTO implements IRegisterInputDTO {
    constructor(
        private readonly dtoEmail: string,
        private readonly dtoPassword: string,
        private readonly dtoFullname: string
    ) { }

    public email(): string {
        return this.dtoEmail
    }
    public password(): string {
        return this.dtoPassword
    }
    fullname(): string {
        return this.dtoFullname
    }
}

export default class AuthInputDTOFactory implements IAuthInputDTOFactory {
    createLoginInputDTO(email: string, password: string): ILoginInputDTO {
        return new LoginInputDTO(email, password)
    }

    createRefreshTokenInputDTO(sessionId: string): IRefreshTokenInputDTO {
        return new RefreshTokenInputDTO(sessionId)
    }
    createRegisterInputDTO(email: string, password: string, fullname: string): IRegisterInputDTO {
        return new RegisterInputDTO(email, password, fullname)
    }
}