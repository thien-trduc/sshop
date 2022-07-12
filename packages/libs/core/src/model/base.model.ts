export abstract class BaseModel {
    public id: number;

    public createdAt: string;

    public updatedAt: string;

    public streamId: string | undefined;

    protected constructor(id: number, createdAt: string, updatedAt: string, streamId?: string) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.streamId = streamId;
    }

    abstract when<T = any>(event: T, name: string): void;
}
