import { TApplicationResults } from '../.shared.domain/types'
import {
    ICreateNewUserInputDTO,
    IFindUserByEmailInputDTO
} from './user.input.dto'
import {
    IFindUserByEmailOutputDTO,
    TCreateNewUserFailedType,
    TFindUserByEmailFailedType
} from './user.output.dto'

export interface IUserService {
    createNewUser(data: ICreateNewUserInputDTO): Promise<TApplicationResults<{}, TCreateNewUserFailedType>>
    findUserByEmail(data: IFindUserByEmailInputDTO): Promise<TApplicationResults<IFindUserByEmailOutputDTO, TFindUserByEmailFailedType>>
}