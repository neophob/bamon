import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { RingBuffer } from './datasource/ring.buffer';
import { DataSnapshot } from './datasource/datasnapshot';

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

  constructor() {
    effect(() => {
      this.lastTimestamp = new Date().toLocaleTimeString();
      console.log('Last update', this.lastTimestamp);
    });
  }

  ngAfterViewInit() {
    //this.lastUpdateTs.nativeElement.
    console.log('LastUpdateTs ngAfterViewInit');
  }
}
