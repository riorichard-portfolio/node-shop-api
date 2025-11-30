import { ISessionEntity } from "./auth.entities";
import {
    ILoginOutputDTO,
    IRefreshTokenOutputDTO
} from "./auth.output.dto";
import {
    ILoginInputDTO,
    IRefreshTokenInputDTO,
    IRegisterInputDTO
} from "./auth.input.dto";

export interface IAuthEntitiesFactory {
    createSession(sessionId: string, userId: string, expiredAt: number): ISessionEntity
}

export interface IAuthInputDTOFactory {
    createLoginInputDTO(email: string, password: string): ILoginInputDTO
    createRegisterInputDTO(email: string, password: string, fullname: string): IRegisterInputDTO
    createRefreshTokenInputDTO(sessionId: string): IRefreshTokenInputDTO
}

export interface IAuthOutputDTOFactory {
    createLoginOutputDTO(accessToken: string, refreshToken: string): ILoginOutputDTO
    createRefreshAccessTokenOutputDTO(newAccessToken: string): IRefreshTokenOutputDTO
}