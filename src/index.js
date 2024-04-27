const W = 512;
const H = 512;

const bleDeviceName = 'AK12100-220600023';
const aks1200Characteristics = '0000ff00-0000-1000-8000-00805f9b34fb';
const requestBasicInformation = new Uint8Array([0xdd, 0xa5, 0x03, 0x00, 0xff, 0xfd, 0x77 ]);

function handleNotifications(event) {
  let value = event.target.value;
  let a = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  console.log('> ' + a.join(' '));
}
async function connectToBle() {
   const bleDevice = await navigator.bluetooth.requestDevice({
    filters: [{ name: bleDeviceName }],
    optionalServices: [aks1200Characteristics]
   });
   console.log('device', bleDevice);

   const server = await bleDevice.gatt?.connect();
   console.log('connected', server);

   const service = await server.getPrimaryService(aks1200Characteristics);
   console.log('service', service);

   let rxCharacteristic = await service.getCharacteristic(0xff01);
   console.log('rxCharacteristic', rxCharacteristic);

   let txCharacteristic = await service.getCharacteristic(0xff02);
   console.log('txCharacteristic', txCharacteristic);

   await rxCharacteristic.startNotifications();
   console.log('> Notifications started');
   rxCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);

   await txCharacteristic.writeValue(requestBasicInformation);
   console.log('> Sent requestBasicInformation');
}

async function disconnectBle() {
  console.log('> TODO');
}

function rndr() {
  console.info('Emulator render');
  //return requestAnimationFrame(rndr);
}

window.connect = connectToBle;
window.disconnect = disconnectBle;

window.onload = async () => {
  const a = document.getElementById("c");
  a.width = W;
  a.height = H;
  c = a.getContext("2d");
  c.fillStyle = 'green';
  c.fillRect(0, 0, W, H);

  c.fillStyle = 'black';
  c.fillRect(4, 4, W-8, H-8);

  console.info('# start')
  rndr();
};
