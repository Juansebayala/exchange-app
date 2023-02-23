agregarMonedasParaConvertir();

function agregarMonedasParaConvertir() {
  fetch('https://api.exchangerate.host/symbols')
  .then(respuesta => respuesta.json())
  .then(respuesta => {
    vaciarMonedasPorDefecto();
    agregarMonedas(respuesta);
  })
  .catch(error => {
    console.error(error);
  })
}

function vaciarMonedasPorDefecto() {
  const $opcionesMonedas = document.querySelectorAll('#moneda option');
  $opcionesMonedas.forEach($opcionMoneda => {
    $opcionMoneda.remove();
  });
}

function agregarMonedas(respuestaMonedas) {
  const $monedas = document.querySelector('#moneda');
  const simbolosMonedas = Object.values(respuestaMonedas)[2];
  const simbolos = Object.keys(simbolosMonedas);
  simbolos.forEach(simbolo => {
    const $opcionMoneda = document.createElement('option');
    $opcionMoneda.value = simbolo;
    $opcionMoneda.textContent = simbolo;
    $monedas.appendChild($opcionMoneda);
  });
}

const $botonBuscarConversiones = document.querySelector('#buscar-conversiones');
$botonBuscarConversiones.onclick = manejarConversiones;

function manejarConversiones(e) {

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

    buscarConversiones(monedaABuscar, cantidad, fechaConversion);
  }

  e.preventDefault();
}

function validarFormulario() {
  const cantidadMonedaSeleccionada = Number(document.querySelector('#cantidad-moneda').value);
  const fechaSeleccionada = Number(document.querySelector('#fecha-conversion').value);
  if (cantidadMonedaSeleccionada <= 0) {
    return 'La cantidad de monedas a convertir debe ser de al menos 1';
  } else if (fechaSeleccionada === 0) {
    return 'Debes seleccionar una fecha';
  }
}

function buscarConversiones(monedaABuscar, cantidad, fechaConversion) {
  fetch(`https://api.exchangerate.host/timeseries?start_date=${fechaConversion}&end_date=${fechaConversion}&base=${monedaABuscar}&amount=${cantidad}&places=2`)
  .then(respuesta => {
    if (respuesta.ok) {
      return respuesta.json();
    }
    throw new Error();
  })
  .then(respuesta => {
      ocultarMensajeErrorCargaAPI();
      const conversionesPorFecha = Object.values(respuesta)[6];
      const conversionesSeleccionadas = Object.values(conversionesPorFecha)[0];
      const siglasMonedas = Object.keys(conversionesSeleccionadas);
      const valoresMonedas = Object.values(conversionesSeleccionadas);
      mostrarResultados(siglasMonedas, valoresMonedas);
  })
  .catch((error) => {
    ocultarAnimacionCargando();
    mostrarMensajeErrorCargaAPI();
  });
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
  $resultados.forEach(resultado => {
    resultado.remove();
  });
}

function mostrarMensajeError(mensaje) {
  const $mensaje = document.querySelector('#mensaje-error div');
  $mensaje.textContent = mensaje;
  $mensaje.classList.remove('oculto');
}
function ocultarMensajeError() {
  document.querySelector('#mensaje-error div').classList.add('oculto');
}

function mostrarAnimacionCargando() {
  document.querySelector('#cargando').classList.remove('oculto');
}
function ocultarAnimacionCargando() {
  document.querySelector('#cargando').classList.add('oculto');
}

function mostrarMensajeErrorCargaAPI() {
  document.querySelector('#mensaje-error-carga div').classList.remove('oculto');
}
function ocultarMensajeErrorCargaAPI() {
  document.querySelector('#mensaje-error-carga div').classList.add('oculto');
}
