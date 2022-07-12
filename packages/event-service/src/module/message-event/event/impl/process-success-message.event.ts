export class ProcessSuccessMessageEvent {
    constructor(public readonly streamId: string, public readonly status: number, public readonly message: string) {}
}
