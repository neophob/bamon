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
  template: `
    <canvas #canvas></canvas>
  `,
})
export class PowerDiagramComponent {

  @ViewChild('canvas') canvas!: ElementRef<any>;
  powerBuffer = new RingBuffer<number>(64);
  chart: any = [];

  constructor(private bleBattery: BleBattery) {
    effect(() => {
      const data = this.bleBattery.signalData();
      this.powerBuffer.add(data.power);
    });
  }

/*
  get powerData(): number[] {
    return
  }
*/

  ngAfterViewInit() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['labels'] as unknown[],
        datasets: [{
          //label: ['My First Dataset'] as unknown,
          data: this.powerBuffer.toArray(),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

}
