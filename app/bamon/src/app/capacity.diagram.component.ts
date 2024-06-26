import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, signal } from '@angular/core';
import { RingBuffer } from './datasource/ring.buffer';
import { BleBattery } from './datasource/ble';
import Chart from 'chart.js/auto';
import { DataSnapshot } from './datasource/datasnapshot';
import { ConsoleLogger } from './datasource/logger.service';


@Component({
  selector: 'capacity-diag',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas></canvas>`,
})
export class CapacityDiagramComponent {
  @ViewChild('canvas') canvas!: ElementRef<any>;
  private capacityPercent = new RingBuffer<number>(30);
  private chart: any = [];
  signalData = signal<DataSnapshot | null>(null);

  constructor(private bleBattery: BleBattery) {
    effect(() => {
      const data = this.bleBattery.signalData();
      this.capacityPercent.add(data.capacityPercent);
      ConsoleLogger.debug('CapacityDiagramComponent effect', data.capacityPercent);

      if (this.chart.data) {
        const updatedData = this.capacityPercent.toArray();
        this.chart.data.datasets[0].data = updatedData;
        this.chart.data.labels = updatedData.map(() => '') as unknown[],
        this.chart.update();
      }
    });
  }

  ngAfterViewInit() {
    const data = this.capacityPercent.toArray();
    ConsoleLogger.debug('CapacityDiagramComponent ngAfterViewInit', data);
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(() => '') as unknown[],
        datasets: [
          {
            data,
            borderWidth: 0,
            backgroundColor: '#303030',
            barPercentage: 0.97,
          },
        ],
      },
      options: {
        events: [],
        aspectRatio: 2.5,
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
            display: true,
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
