import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { DataSnapshot } from './datasource/datasnapshot';
import { BleBattery } from './datasource/ble';

@Component({
  selector: 'last-update-ts',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<b>{{ counter }} updates, last: {{ lastTimestamp }}</b>`,
})
export class LastUpdateTsLabel {
  //@ViewChild('lastTimestamp') lastUpdateTs!: ElementRef<any>;
  lastTimestamp = 'never';
  counter = 0;
  signalData = signal<DataSnapshot | null>(null);

  constructor(private bleBattery: BleBattery, private cdr: ChangeDetectorRef) {
    effect(() => {
      const data = this.bleBattery.signalData();
      this.lastTimestamp = new Date().toLocaleTimeString();
      this.counter++;
      this.cdr.detectChanges();
    });
  }

}
