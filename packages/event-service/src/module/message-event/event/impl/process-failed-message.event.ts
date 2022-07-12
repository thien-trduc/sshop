export class ProcessFailedMessageEvent {
    constructor(
        public readonly streamId: string,
        public readonly messageId: number,
        public readonly status: number,
        public readonly message: string,
        public readonly errorBody: any,
    ) {}
}
