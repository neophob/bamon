import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ConsoleLogger {
  debug(template: string, ...optionalParams: any[]): void {
    console.log(template, ...optionalParams);
  }

  warning(template: string, ...optionalParams: any[]): void {
    console.warn(template, ...optionalParams);
  }

  error(template: string, ...optionalParams: any[]): void {
    console.error(template, ...optionalParams);
  }
}
