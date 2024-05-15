import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { BleBattery } from './datasource/ble';
import { PowerDiagramComponent } from './power.diagram.component';
import { CapacityDiagramComponent } from './capacity.diagram.component';
import { LastUpdateTsLabel } from './last-update-ts.label.component';

/*
        0        263      526      799
        +--------------------------+
        |B 13.2V  | -0.9A  |B      |
  158   +------------------+       |
        |                  |  98%  |
        |      -11.4W      |       |
        | .|..|...||..|..| |.|..|..|
  479   +--------------------------+

#define HISTORY_BAR_WIDTH 5
#define HISTORY_BAR_SPACE 3

const int WATT_ENTIRES(526 / (HISTORY_BAR_WIDTH + HISTORY_BAR_SPACE));    -> 65
const int PERCENT_ENTIRES(273 / (HISTORY_BAR_WIDTH + HISTORY_BAR_SPACE)); -> 4


https://angularexperts.ch/blog/angular-signal-inputs
*/

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatProgressBar,
    MatDivider,
    MatGridListModule,
    MatCard,
    MatCardContent,
    MatCardFooter,
    PowerDiagramComponent,
    CapacityDiagramComponent,
    LastUpdateTsLabel,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  voltage = 0;
  current = 0;
  power = 0;
  capacityTotal = 0;
  connected = false;
  connecting = false;

  constructor(private bleBattery: BleBattery) {
    effect(() => {
      const data = this.bleBattery.signalData();
      console.log('The bleBattery.signalData is:', data);
      this.voltage = data.voltage;
      this.current = data.current;
      this.power = data.power;
      this.capacityTotal = data.capacityTotal;
      this.connecting = this.bleBattery.connecting();
      this.connected = this.bleBattery.connected();
    });
  }

  public connect(): Promise<void> {
    this.bleBattery.disconnect();
    return this.bleBattery.connect();
  }

  public disconnect(): void {
    return this.bleBattery.disconnect();
  }

  public simulate(): void {
    return this.bleBattery.simulate();
  }
}
