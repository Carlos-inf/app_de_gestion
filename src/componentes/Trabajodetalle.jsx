import React, { useState, useEffect } from "react";
import {Modal, Text, Divider, List, Badge, Stack, TextInput, Button, Group, Card} from "@mantine/core";

const Trabajodetalle = ({ trabajo, opened, onClose, onUpdate }) => {
  const [medidas, setMedidas] = useState(trabajo?.medidas || {});
  const [nuevaMedida, setNuevaMedida] = useState({ clave: "", valor: "" });

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
    onUpdate(trabajo.id_trabajo, { ...trabajo, medidas: nuevasMedidas });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg" c="#1A237E">
          Detalle del Trabajo
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
              <strong>Teléfono:</strong> {trabajo.telefono_cliente}
            </Text>
          </Stack>
        </Card>

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
            color={
              trabajo.estado_trabajo === "Terminado"
                ? "teal"
                : trabajo.estado_trabajo === "En Proceso"
                ? "yellow"
                : "red"
            }
          >
            {trabajo.estado_trabajo}
          </Badge>
        </Group>
      </Stack>
    </Modal>
  );
};

export default Trabajodetalle;
