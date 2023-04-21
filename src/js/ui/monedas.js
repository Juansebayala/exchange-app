import { pedirMonedas } from '../servicios/monedas.js';

class Monedas {
  constructor(monedas) {
    this.simbolos = Object.keys(monedas.symbols);
  }
}

function vaciarMonedasPorDefecto() {
  const $opcionesMonedas = document.querySelectorAll('#moneda option');
  $opcionesMonedas.forEach(($opcionMoneda) => {
    $opcionMoneda.remove();
  });
}

function agregarMonedas(simbolos) {
  const $monedas = document.querySelector('#moneda');
  simbolos.forEach((simbolo) => {
    const $opcionMoneda = document.createElement('option');
    $opcionMoneda.value = simbolo;
    $opcionMoneda.textContent = simbolo;
    $monedas.appendChild($opcionMoneda);
  });
}

export default async function agregarMonedasParaConvertir() {
  vaciarMonedasPorDefecto();
  const monedas = new Monedas(await pedirMonedas());
  agregarMonedas(monedas.simbolos);
}
