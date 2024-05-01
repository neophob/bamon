import { Component, ElementRef, ViewChild, effect } from '@angular/core';
import { RingBuffer } from './datasource/ring.buffer';
import { BleBattery } from './datasource/ble';
import Chart from 'chart.js/auto';

/*

TODO:
- draw diag
  - https://stackblitz.com/edit/angular-charts-material-ui-tabs?file=src%2Fapp%2Fapp.component.ts
  - https://www.chartjs.org/docs/latest/charts/bar.html
*/

@Component({
  selector: 'power-diag',
  standalone: true,
  imports: [],
  template: ` <canvas #canvas></canvas> `,
})
export class PowerDiagramComponent {
  @ViewChild('canvas') canvas!: ElementRef<any>;
  powerBuffer = new RingBuffer<number>(64);
  chart: any = [];

  constructor(private bleBattery: BleBattery) {
    effect(() => {
      const data = this.bleBattery.signalData();
      this.powerBuffer.add(data.power);
      console.log('this.powerBuffer', data.power)
    });
  }

  ngAfterViewInit() {
    const data = this.powerBuffer.toArray();
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(() => '') as unknown[],
        datasets: [
          {
            data,
            borderWidth: 0,
            backgroundColor: 'black',
            barPercentage: 0.97,
          },
        ],
      },
      options: {
        events: [],
        aspectRatio: 4,
        animation: false,
        scales: {
          x: {
            display: false,
            border: {
              display: false,
              width: 0,
            },
          },
          y: {
            beginAtZero: true,
            display: false,
            border: {
              display: false,
              width: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
  }
}
