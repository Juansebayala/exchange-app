import { pedirConversiones } from '../servicios/monedas.js';
import {
  mostrarMensajeError,
  mostrarMensajeErrorCargaAPI,
  ocultarMensajeError,
  ocultarMensajeErrorCargaAPI,
} from './errores.js';

export function agregarEventoConversiones() {
  const $botonBuscarConversiones = document.querySelector(
    '#buscar-conversiones'
  );
  $botonBuscarConversiones.onclick = manejarConversiones;
}

function mostrarAnimacionCargando() {
  document.querySelector('#cargando').classList.remove('oculto');
}
function ocultarAnimacionCargando() {
  document.querySelector('#cargando').classList.add('oculto');
}

function manejarConversiones(e) {
  e.preventDefault();

  const errorFormulario = validarFormulario();

  if (errorFormulario) {
    vaciarResultadosAnteriores();
    mostrarMensajeError(errorFormulario);
  } else {
    ocultarMensajeError();
    vaciarResultadosAnteriores();
    mostrarAnimacionCargando();

    const monedaABuscar = document.querySelector('#moneda').value;
    const cantidad = document.querySelector('#cantidad-moneda').value;
    const fechaConversion = document.querySelector('#fecha-conversion').value;

    buscarConversiones(fechaConversion, monedaABuscar, cantidad);
  }
}

function validarFormulario() {
  const cantidadMonedaSeleccionada = Number(
    document.querySelector('#cantidad-moneda').value
  );
  const fechaSeleccionada = Number(
    document.querySelector('#fecha-conversion').value
  );
  if (cantidadMonedaSeleccionada <= 0) {
    return 'La cantidad de monedas a convertir debe ser de al menos 1';
  } else if (fechaSeleccionada === 0) {
    return 'Debes seleccionar una fecha';
  }
}

async function buscarConversiones(fechaConversion, monedaABuscar, cantidad) {
  const respuesta = await pedirConversiones(
    fechaConversion,
    monedaABuscar,
    cantidad
  );
  if (respuesta) {
    ocultarMensajeErrorCargaAPI();
    const conversionesPorFecha = Object.values(respuesta)[6];
    const conversionesSeleccionadas = Object.values(conversionesPorFecha)[0];
    const siglasMonedas = Object.keys(conversionesSeleccionadas);
    const valoresMonedas = Object.values(conversionesSeleccionadas);
    mostrarResultados(siglasMonedas, valoresMonedas);
  } else {
    ocultarAnimacionCargando();
    mostrarMensajeErrorCargaAPI();
  }
}

function mostrarResultados(siglasMonedas, valoresMonedas) {
  ocultarAnimacionCargando();
  const $nodoMonedas = document.querySelector('#resultados-intercambio');
  siglasMonedas.forEach((moneda, indice) => {
    const valorMoneda = valoresMonedas[indice];
    crearTarjetaDeMoneda($nodoMonedas, moneda, valorMoneda);
  });
}

function crearTarjetaDeMoneda($nodoMonedas, moneda, valor) {
  const $tarjeta = document.createElement('div');
  $tarjeta.classList.add('tarjeta');
  const $siglaMoneda = document.createElement('p');
  $siglaMoneda.classList.add('sigla-moneda');
  $siglaMoneda.textContent = moneda;
  const $valorMoneda = document.createElement('p');
  $valorMoneda.textContent = `$${valor}`;
  $tarjeta.appendChild($siglaMoneda);
  $tarjeta.appendChild($valorMoneda);
  $nodoMonedas.appendChild($tarjeta);
}

function vaciarResultadosAnteriores() {
  const $resultados = document.querySelectorAll('.tarjeta');
  $resultados.forEach((resultado) => {
    resultado.remove();
  });
}
