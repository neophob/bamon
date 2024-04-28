import { Injectable } from '@angular/core';
import { ConsoleLogger } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class DataSnapshot {
  public readonly voltage: number;
  public readonly current: number;
  public readonly power: number;
  public readonly capacityNow: number;
  public readonly capacityTotal: number;
  public readonly capacityPercent: number;
  public readonly cycles: number;
  public readonly timestamp: number;
  private logger: ConsoleLogger|undefined;

  constructor(value: DataView) {
    this.voltage = value.getUint16(4) * 0.01;
    this.current = value.getInt16(6) * 0.01;
    this.power = this.voltage * this.current;
    this.capacityNow = value.getUint16(8) * 0.01;
    this.capacityTotal = value.getUint16(10) * 0.01;
    this.capacityPercent = Math.round(
      (100.0 / this.capacityTotal) * this.capacityNow
    );
    this.cycles = value.getUint16(12);
    this.timestamp = Date.now();
    ConsoleLogger.debug('voltage', this.voltage);
    ConsoleLogger.debug('current:', this.current);
    ConsoleLogger.debug('power:', this.power);
    ConsoleLogger.debug('capacity now:', this.capacityNow);
    ConsoleLogger.debug('capacity total:', this.capacityTotal);
    ConsoleLogger.debug('capacity percent:', this.capacityPercent);
    ConsoleLogger.debug('cycles:', this.cycles);
  }
}
