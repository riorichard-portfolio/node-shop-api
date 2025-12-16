import { TApplicationResults } from "../.shared.domain/types"
import {
    ILoginInputDTO,
    IRefreshTokenInputDTO,
    IRegisterInputDTO
} from "./auth.input.dto"
import {
    ILoginOutputDTO,
    IRefreshTokenOutputDTO,
    TLoginFailedType,
    TRefreshTokenFailedType,
    TRegisterFailedType
} from "./auth.output.dto"

export interface IAuthUsecase {
    login(data: ILoginInputDTO): Promise<TApplicationResults<ILoginOutputDTO, TLoginFailedType>>
    register(data: IRegisterInputDTO): Promise<TApplicationResults<{}, TRegisterFailedType>>
    refreshAccessToken(data: IRefreshTokenInputDTO): Promise<TApplicationResults<IRefreshTokenOutputDTO, TRefreshTokenFailedType>>
}