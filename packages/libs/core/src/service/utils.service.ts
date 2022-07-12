import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import * as moment from 'moment';
import * as uuid from 'uuid';

@Injectable()
export class UtilService {
  static excludePropObj<T, Key extends keyof T>(obj: T, ...keys: Key[]): Omit<T, Key> {
    for (const key of keys) {
      delete obj[key];
    }
    return obj;
  }

  static async hashPassword(password: string, salt: number = 10): Promise<string> {
    return bcrypt.hash(password, salt)
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  jsonToQueryString = (obj: { [key: string]: any } = {}): string => {
    return Object.keys(obj)
      .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
      })
      .join('&');
  };

  static getPriceText(price: number): string {
    return `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
  }

  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  static generateString(length: number): string {
    let result = ' ';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  static genTransactionCode(): string {
    const current = moment().utc().toDate().getTime();
    const randomString = this.generateString(3);
    const randomNumber = this.getRandomInt(100, 999);
    return `TDT${current}${randomString}${randomNumber}`.toUpperCase().replace(' ', '');
  }

  static slugVietnameseName(value: string): string {
    const specialCharacter = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    value = value.replace(specialCharacter, '');
    value = value.replace(/\s+|\s+$/g, '-');
    value = value.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    value = value.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    value = value.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    value = value.replace(/o|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    value = value.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    value = value.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    value = value.replace(/đ|d/g, 'd');
    value = value.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    value = value.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return value.toLowerCase();
  }

  static genIdV4(): string {
    return uuid.v4().replace(/-/g, '');
  }
}
