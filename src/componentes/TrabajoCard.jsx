import React from "react";
import { Card, Text, Badge, Button, Group, Stack } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

const ColorDePago = (estado) => {
  if (estado === "Pagado") return "green";
  if (estado === "Abono") return "orange";
  return "red";
};

const TrabajoCard = ({ trabajo, onUpdate, onDelete, onVerDetalle }) => {
  const {
    id_trabajo,
    nombre_cliente,
    nombre_trabajo,
    estado_pago,
    valor_pendiente,
    fecha_recepcion,
    url_boceto,
    medidas,
  } = trabajo;

  const medidasArray = Object.entries(medidas);
  const primeraMedida = medidasArray.length > 0 ? medidasArray[0] : null;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      md="md"
      style={{ borderLeft: `5px solid ${ColorDePago(estado_pago)}` }}
    >
      <Stack gap="xs">
        {trabajo.imagen_url || url_boceto ? (
          <img
            src={trabajo.imagen_url || url_boceto}
            alt={`Imagen de ${trabajo.nombre_trabajo}`}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: "8px",
              display: "block",
              maxHeight: "400px",
              margin: "0 auto",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "150px",
              backgroundColor: "#f3f3f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              color: "#999",
              fontSize: "0.9rem",
            }}
          >
            Sin imagen
          </div>
        )}

        {/* TÍTULO Y CÓDIGO */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={2}>
            <Text fw={700} size="lg" lineClamp={1}>
              {nombre_trabajo}
            </Text>
            <Text size="sm" c="dimmed">
              Cliente: {nombre_cliente}
            </Text>
            <Text size="sm" c="dimmed">
              Recepción:{" "}
              {fecha_recepcion
                ? new Date(fecha_recepcion).toLocaleDateString()
                : "Sin fecha"}
            </Text>
          </Stack>
          <Badge
            color="gray"
            variant="light"
            size="sm"
            tt="uppercase"
            style={{ minWidth: 60 }}
          >
            {id_trabajo}
          </Badge>
        </Group>

        {/* ESTADO DE PAGO Y PENDIENTE */}
        <Group justify="space-between" wrap="nowrap" mt="xs">
          <Badge color={ColorDePago(estado_pago)} variant="filled" size="md">
            {estado_pago}
          </Badge>
          <Text fw={700} size="md" c={valor_pendiente > 0 ? "red" : "green"}>
            Pendiente: ${valor_pendiente.toLocaleString("es-CL")}
          </Text>
        </Group>

        {/* MEDIDA CLAVE (Otro dato adicional) */}
        {primeraMedida && (
          <Text
            size="sm"
            c="blue"
            style={{
              borderTop: "1px solid var(--mantine-color-gray-2)",
              paddingTop: 5,
            }}
          >
            **{primeraMedida[0].toUpperCase()}:** {primeraMedida[1]}
            {medidasArray.length > 1 && (
              <span style={{ fontStyle: "italic", color: "#999" }}>
                {" "}
                (+{medidasArray.length - 1} más)
              </span>
            )}
          </Text>
        )}

        {/* ACCIONES CRUD */}
        <Group grow mt="md">
          <Button
            variant="light"
            color="blue"
            fullWidth
            onClick={() => onUpdate(trabajo)}
            leftSection={<IconEdit size={16} />}
          >
            Editar
          </Button>
          <Button
            variant="light"
            color="red"
            fullWidth
            onClick={() => onDelete(id_trabajo)}
            leftSection={<IconTrash size={16} />}
          >
            Eliminar
          </Button>
          <Button
            variant="light"
            color="blue"
            fullWidth
            onClick={onVerDetalle} // Se pasa como prop
          >
            Ver Detalle
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default TrabajoCard;
