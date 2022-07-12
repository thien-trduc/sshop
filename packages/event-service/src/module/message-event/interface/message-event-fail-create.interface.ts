export interface IMessageEventFailCreate {
    streamId: string;
    messageId: number;
    status: number;
    message: string;
    errorBody: any;
}
