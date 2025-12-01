import React, { useState, useEffect } from "react";
import {Modal, Text, Divider, List, Badge, Stack, TextInput, Button, Group, Card} from "@mantine/core";

const ColorDePago = (estado) => {
    if (estado === "Pagado") return "green";
    if (estado === "Abono") return "orange";
    return "red";
};


const Trabajodetalle = ({ trabajo, opened, onClose, onUpdate }) => {
  // Estado local para Medidas (se inicializa con medidas existentes o un objeto vacío)
  const [medidas, setMedidas] = useState(trabajo?.medidas || {});
  const [nuevaMedida, setNuevaMedida] = useState({ clave: "", valor: "" });

  // Resetea el estado local cuando el trabajo cambia (al abrir otro modal)
  useEffect(() => {
    setMedidas(trabajo?.medidas || {});
    setNuevaMedida({ clave: "", valor: "" });
  }, [trabajo]);

  if (!trabajo) return null;

  const handleAgregarMedida = () => {
    const { clave, valor } = nuevaMedida;
    if (!clave.trim() || !valor.trim()) {
      alert("Completa ambos campos antes de agregar una medida.");
      return;
    }

    const nuevasMedidas = { ...medidas, [clave.trim()]: valor.trim() };
    setMedidas(nuevasMedidas);
    setNuevaMedida({ clave: "", valor: "" });
    
    // Usar trabajo.id (ID numérico) para la API
    onUpdate(trabajo.id, { ...trabajo, medidas: nuevasMedidas });
  };

  // Cálculos de formato
   const valorTotal = trabajo.valor_total || 0;
   const abonoRecibido = trabajo.abono_recibido || 0;
   // Asumimos que valor_pendiente es un campo calculado por Laravel
   const valorPendiente = trabajo.valor_pendiente || (valorTotal - abonoRecibido); 


  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg" c="#1A237E">
          Detalle del Trabajo ({trabajo.id_trabajo})
        </Text>
      }
      size="lg"
      radius="md"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      <Stack spacing="md">
        {/* ENCABEZADO */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Stack spacing={4}>
            <Text fw={700} size="xl" c="#0E9D58">
              {trabajo.nombre_trabajo}
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Cliente:</strong> {trabajo.nombre_cliente}
            </Text>
            <Text size="sm" c="dimmed">
              <strong>Teléfono:</strong> {trabajo.telefono_cliente || "N/A"}
            </Text>
          </Stack>
        </Card>

        {/* FINANZAS y NOTAS */}
         <Group grow>
             <Card shadow="sm" p="md" radius="md" withBorder>
                 <Stack spacing={2}>
                     <Text fw={500} size="md">Información de Pago</Text>
                     <Text size="sm">
                         <strong>Valor Total:</strong> ${valorTotal.toLocaleString("es-CL")}
                     </Text>
                     <Text size="sm" c="blue">
                         <strong>Abono Recibido:</strong> ${abonoRecibido.toLocaleString("es-CL")}
                     </Text>
                     <Text size="md" fw={700} c={valorPendiente > 0 ? "red" : "green"}>
                         <strong>Pendiente:</strong> ${valorPendiente.toLocaleString("es-CL")}
                     </Text>
                 </Stack>
             </Card>
             <Card shadow="sm" p="md" radius="md" withBorder>
                 <Text fw={500} size="md">Notas</Text>
                 <Text size="sm" c="dimmed">
                     {trabajo.notas || "Sin notas adicionales."}
                 </Text>
             </Card>
         </Group>


        {/* FECHAS */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Stack spacing={2}>
            <Text size="sm">
              <strong>Fecha de recepción:</strong>{" "}
              {trabajo.fecha_recepcion
                ? new Date(trabajo.fecha_recepcion).toLocaleDateString()
                : "Sin fecha"}
            </Text>
            <Text size="sm">
              <strong>Fecha de entrega:</strong>{" "}
              {trabajo.fecha_entrega
                ? new Date(trabajo.fecha_entrega).toLocaleDateString()
                : "Sin fecha"}
            </Text>
          </Stack>
        </Card>

        {/* MEDIDAS */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Stack spacing="xs">
            <Text fw={500}>Medidas Registradas</Text>
            <div
              style={{
                maxHeight: 200,
                overflowY: "auto",
                paddingRight: 5,
                backgroundColor: "#F5F7FA",
                borderRadius: "8px",
              }}
            >
              <List spacing="xs">
                {Object.entries(medidas).length > 0 ? (
                  Object.entries(medidas).map(([clave, valor]) => (
                    <List.Item key={clave}>
                      <Text size="sm">
                        <strong>{clave}:</strong> {valor}
                      </Text>
                    </List.Item>
                  ))
                ) : (
                  <Text size="sm" c="dimmed">
                    Sin medidas registradas
                  </Text>
                )}
              </List>
            </div>

            <Divider />

            {/* NUEVA MEDIDA */}
            <Text fw={500}>Agregar nueva medida</Text>
            <Group grow>
              <TextInput
                placeholder="Nombre de la medida (Ej: Largo, Cintura)"
                value={nuevaMedida.clave}
                onChange={(e) =>
                  setNuevaMedida({ ...nuevaMedida, clave: e.target.value })
                }
              />
              <TextInput
                placeholder="Valor con unidad (Ej: 150 cm)"
                value={nuevaMedida.valor}
                onChange={(e) =>
                  setNuevaMedida({ ...nuevaMedida, valor: e.target.value })
                }
              />
            </Group>
            <Button
              color="#0E9D58"
              onClick={handleAgregarMedida}
              variant="filled"
              radius="md"
            >
              Agregar Medida
            </Button>
          </Stack>
        </Card>

        {/* ESTADO */}
        <Group position="center">
          <Badge
            size="lg"
            color={ColorDePago(trabajo.estado_pago)} 
          >
            {trabajo.estado_trabajo}
          </Badge>
        </Group>
      </Stack>
    </Modal>
  );
};

export default Trabajodetalle;