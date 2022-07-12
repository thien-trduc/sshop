import {PageOptionsDto} from "../dto/page-options.dto";
import {PageResponseDto} from "../dto/page-response.dto";

export abstract class IGenericService<T> {
  abstract page(options: PageOptionsDto): Promise<PageResponseDto<T>>;
  abstract findById(id: string | number): Promise<T>;
}
