/// <reference types="web-bluetooth" />
import { Injectable } from '@angular/core';
import { DataSnapshot } from './datasnapshot';
import { ConsoleLogger } from './logger.service';

const bleDeviceName = 'AK12100-220600023';
const aks1200Characteristics = '0000ff00-0000-1000-8000-00805f9b34fb';
const requestBasicInformation = new Uint8Array([
  0xdd, 0xa5, 0x03, 0x00, 0xff, 0xfd, 0x77,
]);
const delayFirstRequestS = 1;
const dataFetcherIntervalS = 8;

@Injectable({
  providedIn: 'root',
})
export class BleBattery {
  private bleDevice?: BluetoothDevice;
  private server?: BluetoothRemoteGATTServer;
  private service?: BluetoothRemoteGATTService;
  private rxCharacteristic?: BluetoothRemoteGATTCharacteristic;
  private txCharacteristic?: BluetoothRemoteGATTCharacteristic;
  private intervalId?: any;

  constructor(private logger: ConsoleLogger) {}

  async connect(): Promise<void> {
    try {
      this.bleDevice = await navigator.bluetooth.requestDevice({
        filters: [{ name: bleDeviceName }],
        optionalServices: [aks1200Characteristics],
      });
      this.bleDevice.addEventListener('gattserverdisconnected', (event) => {
        this.logger.error('ERROR: Bluetooth Device disconnected', event);
        this.disconnect();
      });

      this.logger.debug('device found', this.bleDevice);

      this.logger.debug('connect to device');
      this.server = await this.bleDevice.gatt?.connect();
      if (!this.server) {
        this.logger.error('ERROR: connection failed, server is undefined');
        this.disconnect();
        return;
      }
      this.logger.debug('connected', this.server);

      this.service = await this.server.getPrimaryService(
        aks1200Characteristics
      );
      this.logger.debug('service', this.service);

      this.rxCharacteristic = await this.service.getCharacteristic(0xff01);
      this.logger.debug('rxCharacteristic', this.rxCharacteristic);
      this.rxCharacteristic.addEventListener(
        'characteristicvaluechanged',
        (event) => {
          const characteristic =
            event.target as BluetoothRemoteGATTCharacteristic;
          if (
            characteristic.value &&
            characteristic.value.getUint8(0) === 0xdd
          ) {
            //TODO use this in data holder structure
            const data = new DataSnapshot(characteristic.value);
          }
        }
      );
      await this.rxCharacteristic.startNotifications();
      this.logger.debug('> Notifications started');

      this.txCharacteristic = await this.service.getCharacteristic(0xff02);
      this.logger.debug('txCharacteristic', this.txCharacteristic);

      setTimeout(() => {
        this.requestBasicInformation();
      }, delayFirstRequestS * 1000);

      this.intervalId = setInterval(() => {
        this.requestBasicInformation();
      }, dataFetcherIntervalS * 1000);
    } catch (error) {
      this.logger.error('connection failed!', error);
      this.disconnect();
    }
  }

  disconnect(): void {
    clearInterval(this.intervalId);
    if (this.bleDevice?.gatt?.connected) {
      this.logger.debug('Disconnect gatt server');
      this.bleDevice.gatt?.disconnect();
    } else {
      this.logger.debug('Disconnect failed, not connected');
    }
  }

  async requestBasicInformation(): Promise<void> {
    try {
      await this.txCharacteristic?.writeValue(requestBasicInformation);
      this.logger.debug('> Sent requestBasicInformation');
    } catch (error) {
      this.logger.error('requestBasicInformation failed!', error);
    }
  }
}
