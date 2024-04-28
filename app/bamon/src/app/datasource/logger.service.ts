import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ConsoleLogger {
  static debug(template: string, ...optionalParams: any[]): void {
    console.log('D: ' + template, ...optionalParams);
  }

  static warning(template: string, ...optionalParams: any[]): void {
    console.warn('W: ' + template, ...optionalParams);
  }

  static error(template: string, ...optionalParams: any[]): void {
    console.error('E: ' + template, ...optionalParams);
  }
}
