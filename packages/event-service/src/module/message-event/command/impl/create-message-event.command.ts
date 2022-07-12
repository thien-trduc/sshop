export class CreateMessageEventCommand {
    constructor(public readonly type: string, public readonly title: string, public readonly topicid: string, public readonly data: any) {}
}
