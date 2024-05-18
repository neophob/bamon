import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { DataSnapshot } from './datasource/datasnapshot';
import { BleBattery } from './datasource/ble';

@Component({
  selector: 'last-update-ts',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p style="text-align:center">{{ counter }} updates, last: {{ lastTimestamp }}</p>`,
})
export class LastUpdateTsLabel {
  lastTimestamp = 'never';
  counter = -1;
  signalData = signal<DataSnapshot | null>(null);

  constructor(private bleBattery: BleBattery, private cdr: ChangeDetectorRef) {
    effect(() => {
      const data = this.bleBattery.signalData();
      if (this.counter >= 0) {
        this.lastTimestamp = new Date().toLocaleTimeString();
      }
      this.counter++;
      this.cdr.detectChanges();
    });
  }

}
