import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BleBattery } from './datasource/ble';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private bleBattery: BleBattery) {}
  title = 'bamon';

  public connect(): Promise<void> {
    return this.bleBattery.connect();
  }

  public disconnect(): void {
    return this.bleBattery.disconnect();
  }

}
