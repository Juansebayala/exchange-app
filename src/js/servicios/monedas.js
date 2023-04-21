export async function pedirMonedas() {
  try {
    const respuesta = await fetch('https://api.exchangerate.host/symbols');
    return await respuesta.json();
  } catch (error) {
    console.error(error);
  }
}

export async function pedirConversiones(
  fechaConversion,
  monedaABuscar,
  cantidad
) {
  try {
    console.log(
      `https://api.exchangerate.host/timeseries?start_date=${fechaConversion}&end_date=${fechaConversion}&base=${monedaABuscar}&amount=${cantidad}&places=2`
    );
    const respuesta = await fetch(
      `https://api.exchangerate.host/timeseries?start_date=${fechaConversion}&end_date=${fechaConversion}&base=${monedaABuscar}&amount=${cantidad}&places=2`
    );
    if (respuesta.ok) {
      return await respuesta.json();
    }
    throw new Error();
  } catch (error) {
    return error;
  }
}
