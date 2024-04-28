const BleBattery = require('./ble');

const ble = new BleBattery();
console.info('Note: to see log, enable verbose level in Chrome!');

/*

https://kat-leight.medium.com/fun-with-the-web-bluetooth-api-and-react-a2bbe2aba7a9

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
  console.info('# start')
  rndr();
};
