const debug = require('debug')('BleBattery');

const bleDeviceName = 'AK12100-220600023';
const aks1200Characteristics = '0000ff00-0000-1000-8000-00805f9b34fb';
const requestBasicInformation = new Uint8Array([0xdd, 0xa5, 0x03, 0x00, 0xff, 0xfd, 0x77 ]);

module.exports = class BleBattery {

    constructor() {
        this.bleDevice = null;
    }

    async connect() {
        console.log(this)
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
                let value = event.target.value;
                let a = [];
                // Convert raw data bytes to hex values just for the sake of showing something.
                // In the "real" world, you'd use data.getUint8, data.getUint16 or even
                // TextDecoder to process raw data bytes.
                for (let i = 0; i < value.byteLength; i++) {
                  a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
                }
                debug('> ' + a.join(' '));
            });
            await this.rxCharacteristic.startNotifications();
            debug('> Notifications started');

            this.txCharacteristic = await this.service.getCharacteristic(0xff02);
            debug('txCharacteristic', this.txCharacteristic);

            this.requestBasicInformation();
        } catch (error) {
            debug('ERROR: connection failed!', error);
            this.disconnect();
        }
    }

    disconnect() {
        if (this.bleDevice?.gatt?.connected) {
            debug('Disconnect gatt server');
            this.bleDevice.gatt.disconnect();
        } else {
            debug('Disconnect failed, not connected');
        }
    }

    async requestBasicInformation() {
        await this.txCharacteristic?.writeValue(requestBasicInformation);
        debug('> Sent requestBasicInformation');
    }

}