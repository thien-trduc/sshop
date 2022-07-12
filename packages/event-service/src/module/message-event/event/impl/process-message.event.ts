export class ProcessMessageEvent {
    constructor(public readonly streamId: string, public readonly messageId: number, public readonly status: number) {}
}
