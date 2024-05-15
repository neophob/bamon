import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { RingBuffer } from './datasource/ring.buffer';
import { DataSnapshot } from './datasource/datasnapshot';
import { BleBattery } from './datasource/ble';

@Component({
  selector: 'last-update-ts',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<b>Last Update: never</b>`,
})
export class LastUpdateTsLabel {
  lastTimestamp = 'never';
  @ViewChild('last-update-ts') lastUpdateTs!: ElementRef<any>;
  signalData = signal<DataSnapshot | null>(null);

  constructor(private bleBattery: BleBattery) {
    effect(() => {
      const data = this.bleBattery.signalData();
      this.lastTimestamp = new Date().toLocaleTimeString();
      console.log('Last update', this.lastTimestamp);
    });
  }

  ngAfterViewInit() {
    //this.lastUpdateTs.nativeElement = 'fff'
    console.log('LastUpdateTs ngAfterViewInit');
  }
}
