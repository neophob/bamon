import { Injectable, inject } from "@angular/core";

import debugModule from 'debug';
import { ConsoleLogger } from "./logger.service";
const debug = debugModule('DataSnapshot');

@Injectable({
  providedIn: 'root'
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

    private logger = inject(ConsoleLogger);

    constructor(value: DataView) {
        this.voltage = value.getUint16(4) * 0.01;
        this.current = value.getInt16(6) * 0.01;
        this.power = this.voltage * this.current;
        this.capacityNow = value.getUint16(8) * 0.01;
        this.capacityTotal = value.getUint16(10) * 0.01;
        this.capacityPercent = Math.round((100.0/this.capacityTotal) * this.capacityNow);
        this.cycles = value.getUint16(12);
        this.timestamp = Date.now();
        this.logger.debug('voltage', this.voltage);
        this.logger.debug('current:', this.current);
        this.logger.debug('power:', this.power);
        this.logger.debug('capacity now:', this.capacityNow);
        this.logger.debug('capacity total:', this.capacityTotal);
        this.logger.debug('capacity percent:', this.capacityPercent);
        this.logger.debug('cycles:', this.cycles);
    }
}
