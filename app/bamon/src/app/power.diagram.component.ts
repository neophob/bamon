import { Component, effect } from '@angular/core';
import { RingBuffer } from './datasource/ring.buffer';
import { BleBattery } from './datasource/ble';

/*

TODO:
- draw diag
  - https://stackblitz.com/edit/angular-charts-material-ui-tabs?file=src%2Fapp%2Fapp.component.ts
  - https://www.chartjs.org/docs/latest/charts/bar.html
*/

@Component({
  selector: '',
  standalone: true,
  imports: [],
  templateUrl: './power.diagram.component.html',
  styleUrl: './power.diagram.component.css'
})
export class PowerDiagramComponent {

  powerBuffer = new RingBuffer<number>(64);

  constructor(private bleBattery: BleBattery) {
    effect(() => {
      const data = this.bleBattery.signalData();
      this.powerBuffer.add(data.power);
    });
  }

  get powerData(): number[] {
    return this.powerBuffer.toArray();
  }

}
