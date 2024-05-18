import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConsoleLogger {

  static _log(level: string, template: string, ...optionalParams: any[]):void {
    const now = new Date().toLocaleTimeString();
    console.log(`${now} - ${level}: ${template}`, ...optionalParams);
  }

  static debug(template: string, ...optionalParams: any[]): void {
    ConsoleLogger._log('D', template, optionalParams);
  }

  static warning(template: string, ...optionalParams: any[]): void {
    ConsoleLogger._log('W', template, optionalParams);
  }

  static error(template: string, ...optionalParams: any[]): void {
    ConsoleLogger._log('E', template, optionalParams);
  }
}
