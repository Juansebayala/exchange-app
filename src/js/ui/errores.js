export function mostrarMensajeError(mensaje) {
  const $mensaje = document.querySelector('#mensaje-error div');
  $mensaje.textContent = mensaje;
  $mensaje.classList.remove('oculto');
}

export function ocultarMensajeError() {
  document.querySelector('#mensaje-error div').classList.add('oculto');
}

export function mostrarMensajeErrorCargaAPI() {
  document.querySelector('#mensaje-error-carga div').classList.remove('oculto');
}

export function ocultarMensajeErrorCargaAPI() {
  document.querySelector('#mensaje-error-carga div').classList.add('oculto');
}
