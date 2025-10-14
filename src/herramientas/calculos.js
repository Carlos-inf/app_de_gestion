/**
 * Aplica la lógica de negocio para calcular el Valor Pendiente y el Estado de Pago
 * basándose en los campos financieros del trabajo.
 */
export const calcularDatos = (trabajo) => {
  // Cálculo del valor pendiente
  const valorPendiente = trabajo.valor_total - trabajo.abono_recibido;
  let estadoPago = "Falta por Pagar";

  // Lógica para determinar el Estado de Pago (Enum)
  if (trabajo.abono_recibido > 0 && valorPendiente > 0) {
    estadoPago = "Abono"; // Recibió algo, pero aún debe.
  } else if (valorPendiente <= 0) {
    estadoPago = "Pagado"; // Valor pendiente es cero o negativo (pago excesivo).
  }
  // Si abono_recibido es 0, se queda como "Falta por Pagar" por defecto.

  return {
    ...trabajo,
    valor_pendiente: valorPendiente,
    estado_pago: estadoPago
  };
};