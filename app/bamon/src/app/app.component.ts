import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { BleBattery } from './datasource/ble';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
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
