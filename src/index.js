const W = 512;
const H = 512;

const aks1200Characteristics = '0000ff00-0000-1000-8000-00805f9b34fb';

async function connectToBle() {
   const a = await navigator.bluetooth.requestDevice({
    optionalServices: [aks1200Characteristics]
   });

   console.log(a);
}

function rndr() {
  console.info('Emulator render');
  return requestAnimationFrame(rndr);
}

window.connect = connectToBle;

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
