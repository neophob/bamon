const debug = require('debug')('BleBattery');

const bleDeviceName = 'AK12100-220600023';
const aks1200Characteristics = '0000ff00-0000-1000-8000-00805f9b34fb';
const requestBasicInformation = new Uint8Array([0xdd, 0xa5, 0x03, 0x00, 0xff, 0xfd, 0x77 ]);
const delayFirstRequestS = 1;
const dataFetcherIntervalS = 8;

class DataSnapshot {
    constructor(value) {
        this.voltage = value.getUint16(4) * 0.01;
        this.current = value.getInt16(6) * 0.01;
        this.power = this.voltage * this.current;
        this.capacityNow = value.getUint16(8) * 0.01;
        this.capacityTotal = value.getUint16(10) * 0.01;
        this.capacityPercent = Math.round((100.0/this.capacityTotal) * this.capacityNow);
        this.cycles = value.getUint16(12);
        this.timestamp = Date.now();
        debug('voltage', this.voltage);
        debug('current:', this.current);
        debug('power:', this.power);
        debug('capacity now:', this.capacityNow);
        debug('capacity total:', this.capacityTotal);
        debug('capacity percent:', this.capacityPercent);
        debug('cycles:', cycles);
    }
}

module.exports = class BleBattery {

    constructor() {
        this.bleDevice = null;
    }

    async connect() {
        try {
            this.bleDevice = await navigator.bluetooth.requestDevice({
                filters: [{ name: bleDeviceName }],
                optionalServices: [aks1200Characteristics]
            });
            this.bleDevice.addEventListener('gattserverdisconnected', (event) => {
                debug('ERROR: Bluetooth Device disconnected', event);
                this.disconnect();
            });

            debug('device found', this.bleDevice);

            debug('connect to device');
            this.server = await this.bleDevice.gatt?.connect();
            debug('connected', this.server);

            this.service = await this.server.getPrimaryService(aks1200Characteristics);
            debug('service', this.service);

            this.rxCharacteristic = await this.service.getCharacteristic(0xff01);
            debug('rxCharacteristic', this.rxCharacteristic);
            this.rxCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
                const value = event.target.value;
                if (value.getUint8(0) === 0xDD) {
                    //TODO use this in data holder structure
                    const data = new DataSnapshot(value);
                }
            });
            await this.rxCharacteristic.startNotifications();
            debug('> Notifications started');

            this.txCharacteristic = await this.service.getCharacteristic(0xff02);
            debug('txCharacteristic', this.txCharacteristic);

            setTimeout(() => {
                this.requestBasicInformation();
            }, delayFirstRequestS * 1000);

            this.intervalId = setInterval(() => {
                this.requestBasicInformation();
            }, dataFetcherIntervalS * 1000);
        } catch (error) {
            debug('ERROR: connection failed!', error);
            this.disconnect();
        }
    }

    disconnect() {
        clearInterval(this.intervalId);
        if (this.bleDevice?.gatt?.connected) {
            debug('Disconnect gatt server');
            this.bleDevice.gatt?.disconnect();
        } else {
            debug('Disconnect failed, not connected');
        }
    }

    async requestBasicInformation() {
        try {
            await this.txCharacteristic?.writeValue(requestBasicInformation);
            debug('> Sent requestBasicInformation');
        } catch(error) {
            debug('ERROR: requestBasicInformation failed!', error);
        }
    }

}