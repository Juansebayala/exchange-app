import { pedirMonedas } from '../servicios/monedas.js';

export async function agregarMonedasParaConvertir() {
  vaciarMonedasPorDefecto();
  agregarMonedas(await pedirMonedas());
}

function vaciarMonedasPorDefecto() {
  const $opcionesMonedas = document.querySelectorAll('#moneda option');
  $opcionesMonedas.forEach(($opcionMoneda) => {
    $opcionMoneda.remove();
  });
}

function agregarMonedas(respuestaMonedas) {
  const $monedas = document.querySelector('#moneda');
  const simbolosMonedas = Object.values(respuestaMonedas)[2];
  const simbolos = Object.keys(simbolosMonedas);
  simbolos.forEach((simbolo) => {
    const $opcionMoneda = document.createElement('option');
    $opcionMoneda.value = simbolo;
    $opcionMoneda.textContent = simbolo;
    $monedas.appendChild($opcionMoneda);
  });
}
