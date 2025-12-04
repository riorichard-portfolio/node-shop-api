import AuthEntitiesFactory from '../../entity.factories/auth.entity.factory'
import UserEntitiesFactory from '../../entity.factories/user.entity.factory'
import AuthInputDTOFactory from '../../dto.factories/auth/auth.input.dto.factory'
import AuthOutputDTOFactory from '../../dto.factories/auth/auth.output.dto.factory'

export default class AppFactories {
    private readonly authEntitiesFactoryValue: AuthEntitiesFactory
    private readonly userEntitiesFactoryValue: UserEntitiesFactory
    private readonly authInputDTOFactoryValue: AuthInputDTOFactory
    private readonly authOutputDTOFactoryValue: AuthOutputDTOFactory

    constructor() {
        this.authEntitiesFactoryValue = new AuthEntitiesFactory()
        this.userEntitiesFactoryValue = new UserEntitiesFactory()
        this.authInputDTOFactoryValue = new AuthInputDTOFactory()
        this.authOutputDTOFactoryValue = new AuthOutputDTOFactory()
    }

    public authEntitiesFactory() {
        return this.authEntitiesFactoryValue
    }

    public userEntitiesFactory() {
        return this.userEntitiesFactoryValue
    }

    public authInputDTOFactory() {
        return this.authInputDTOFactoryValue
    }

    public authOutputDTOFactory() {
        return this.authOutputDTOFactoryValue
    }
}