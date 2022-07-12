
export abstract class IGenericRepository<T> {
    abstract page(page: number, limit: number, filter?: Partial<Record<keyof T, any>>, sort?: Partial<Record<keyof T, unknown>>): Promise<T[]>;
    abstract count(filter?: Partial<Record<keyof T, any>>): Promise<number>;
    abstract findById(id: string | number): Promise<T>;
    abstract findOne(filter: Partial<Record<keyof T, any>>): Promise<T>;
    abstract create(model: T): Promise<T>;
    abstract update(id: string | number, model: T): Promise<T>;
    abstract deleteById(id: string | number): Promise<void>;
}
