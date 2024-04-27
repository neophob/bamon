const BleBattery = require('./ble');

const W = 512;
const H = 512;

const ble = new BleBattery();
console.info('Note: to see log, enable verbose level in Chrome!');

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
function rndr() {
  console.info('Emulator render');
  //return requestAnimationFrame(rndr);
}

window.connect = ble.connect;
window.disconnect = ble.disconnect;
window.requestBasicInformation = ble.requestBasicInformation;

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
