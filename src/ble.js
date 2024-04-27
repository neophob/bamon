const debug = require('debug')('BleBattery');

const bleDeviceName = 'AK12100-220600023';
const aks1200Characteristics = '0000ff00-0000-1000-8000-00805f9b34fb';
const requestBasicInformation = new Uint8Array([0xdd, 0xa5, 0x03, 0x00, 0xff, 0xfd, 0x77 ]);

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
                const initialByte = value.getUint8(0);
                if (initialByte === 0xdd) {
                    const voltage = value.getUint16(4) * 0.01;
                    const current = value.getInt16(6) * 0.01;
                    const power = voltage * current;
                    const capacityNow = value.getUint16(8) * 0.01;
                    const capacityTotal = value.getUint16(10) * 0.01;
                    const capacityPercent = Math.round((100.0/capacityTotal) * capacityNow);
                    debug('---');
                    debug('voltage', voltage);
                    debug('current:', current);
                    debug('power:', power);
                    debug('capacity now:', capacityNow);
                    debug('capacity total:', capacityTotal);
                    debug('capacity percent:', capacityPercent);
                    debug('cycles:', value.getUint16(12));
                    debug('production_date:', value.getUint16(14));
                }
            });
            await this.rxCharacteristic.startNotifications();
            debug('> Notifications started');

            this.txCharacteristic = await this.service.getCharacteristic(0xff02);
            debug('txCharacteristic', this.txCharacteristic);

            this.requestBasicInformation();
            this.requestBasicInformation();

            setInterval(() => {
                this.requestBasicInformation();
                this.requestBasicInformation();
            }, 8000);
        } catch (error) {
            debug('ERROR: connection failed!', error);
            this.disconnect();
        }
    }

    disconnect() {
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