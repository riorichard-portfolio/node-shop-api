import Config from './.base.config'
import { IKafkaConfig } from '../.domains/.shared.domain/config'

export default class KafkaConfig extends Config implements IKafkaConfig {
    private readonly brokerNodesValue: string[]
    private readonly clientIdValue: string
    private readonly groupIdValue: string
    constructor(
        brokerNodes: unknown,
        clientId: unknown,
        groupId: unknown
    ) {
        super()
        const brokerNodesValueArray = this.safelyConvertToArray(brokerNodes)
        this.brokerNodesValue = brokerNodesValueArray.map(brokerNode =>
            this.safelyGetString(brokerNode)
        )
        this.clientIdValue = this.safelyGetString(clientId)
        this.groupIdValue = this.safelyGetString(groupId)
    }

    public brokerNodes(): string[] {
        return this.brokerNodesValue
    }

    public clientId(): string {
        return this.clientIdValue
    }

    public groupId(): string {
        return this.groupIdValue
    }
}