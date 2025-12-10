import Config from './.base.config'
import { IKafkaConfig } from '../.domains/.shared.domain/config'

export default class KafkaConfig extends Config implements IKafkaConfig {
    private readonly brokerNodesValue: string[]
    private readonly clientIdValue: string
    private readonly groupIdValue: string
    constructor(
        brokerNodes: string[],
        clientId: string,
        groupId: string
    ) {
        super()
        this.brokerNodesValue = brokerNodes
        this.clientIdValue = clientId
        this.groupIdValue = groupId
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