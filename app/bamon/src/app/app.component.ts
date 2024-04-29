import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BleBattery } from './datasource/ble';

/*
        0        263      526      799
        +--------------------------+
        |B 13.2V  | -0.9A  |B      |
  158   +------------------+       |
        |                  |  98%  |
        |      -11.4W      |       |
        | .|..|...||..|..| |.|..|..|
  479   +--------------------------+
*/

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  voltage = 0;
  current = 0;
  power = 0;
  capacityTotal = 0;

  constructor(private bleBattery: BleBattery) {
    effect(() => {
      const data = this.bleBattery.signalData();
      console.log('The bleBattery.signalData is:', data);
      this.voltage = data.voltage;
      this.current = data.current;
      this.power = data.power;
      this.capacityTotal = data.capacityTotal;
    });
  }

  public connect(): Promise<void> {
      return this.bleBattery.connect();
  }

  public disconnect(): void {
    return this.bleBattery.disconnect();
  }

}
