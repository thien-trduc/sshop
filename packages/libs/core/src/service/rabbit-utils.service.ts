
export class RabbitUtils {
    static transform<T = any>(data: Buffer): T {
      let res: T;
      res = (JSON.parse(JSON.stringify(data)).data);
      return res;
    }
}
