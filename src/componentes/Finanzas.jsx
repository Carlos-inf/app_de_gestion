import React, { useMemo, useState } from "react";
import { Card, Text, Title, Group, Select, Divider, Stack, Badge } from "@mantine/core";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Finanzas = ({ trabajos }) => {
  const [periodo, setPeriodo] = useState("mensual");

  // Agrupar por semana y mes
  const resumenFinanciero = useMemo(() => {
    const agrupado = {};
    trabajos.forEach((t) => {
      const fecha = new Date(t.fecha_entrega || t.fecha_recepcion);
      if (isNaN(fecha)) return;

      const key =
        periodo === "semanal"
          ? `${fecha.getFullYear()}-S${Math.ceil(fecha.getDate() / 7)}`
          : `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;

      if (!agrupado[key]) agrupado[key] = { total: 0, pendiente: 0, cobrados: 0 };

      agrupado[key].total += Number(t.valor_total || 0);
      agrupado[key].pendiente += Number(t.valor_pendiente || 0);
      agrupado[key].cobrados += Number(t.valor_total || 0) - Number(t.valor_pendiente || 0);
    });

    return Object.entries(agrupado)
    .map(([periodo, valores]) => ({ periodo, ...valores }))
    .sort((a, b) => {
      if (periodo === "semanal") {
        // Extraer año y semana
        const [yearA, weekA] = a.periodo.split("-S").map(Number);
        const [yearB, weekB] = b.periodo.split("-S").map(Number);
        return yearA !== yearB ? yearA - yearB : weekA - weekB;
      } else {
        // Orden mensual
        const [yearA, monthA] = a.periodo.split("-").map(Number);
        const [yearB, monthB] = b.periodo.split("-").map(Number);
        return yearA !== yearB ? yearA - yearB : monthA - monthB;
      }
    });
}, [trabajos, periodo]);

  const totalGeneral = resumenFinanciero.reduce(
    (acc, item) => {
      acc.total += item.total;
      acc.cobrados += item.cobrados;
      acc.pendiente += item.pendiente;
      return acc;
    },
    { total: 0, cobrados: 0, pendiente: 0 }
  );

  return (
    <Stack spacing="md" p="md">
      <Group position="apart">
        <Title order={3} c="#1A237E">
          Finanzas ({periodo === "mensual" ? "Mensual" : "Semanal"})
        </Title>

        <Select
          data={[
            { value: "semanal", label: "Vista Semanal" },
            { value: "mensual", label: "Vista Mensual" },
          ]}
          value={periodo}
          onChange={setPeriodo}
          w={180}
        />
      </Group>

      <Group grow>
        <Card shadow="sm" radius="md" withBorder>
          <Text fw={500} c="#0E9D58">
            Total Ingresos
          </Text>
          <Title order={3}>${totalGeneral.cobrados.toLocaleString()}</Title>
        </Card>

        <Card shadow="sm" radius="md" withBorder>
          <Text fw={500} c="#D32F2F">
            Pendiente de Cobro
          </Text>
          <Title order={3}>${totalGeneral.pendiente.toLocaleString()}</Title>
        </Card>

        <Card shadow="sm" radius="md" withBorder>
          <Text fw={500} c="#1A237E">
            Valor Total Trabajos
          </Text>
          <Title order={3}>${totalGeneral.total.toLocaleString()}</Title>
        </Card>
      </Group>

      <Divider />

      <Card shadow="sm" radius="md" withBorder p="md">
        <Text fw={600} mb="xs" c="#1A237E">
          Evolución Financiera
        </Text>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={resumenFinanciero}>
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cobrados" fill="#0E9D58" name="Cobrados" />
              <Bar dataKey="pendiente" fill="#D32F2F" name="Pendiente" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Divider />

      <Card shadow="sm" radius="md" withBorder>
        <Text fw={500}>Resumen de Trabajos</Text>
        <Stack spacing={4} mt="xs">
          {trabajos.map((t) => (
            <Group
              key={t.id_trabajo}
              position="apart"
              style={{ borderBottom: "1px solid #eee", paddingBottom: 4 }}
            >
              <Text size="sm">
                <strong>{t.nombre_trabajo}</strong> ({t.nombre_cliente})
              </Text>
              <Badge
                color={t.estado_trabajo === "Terminado" ? "teal" : "yellow"}
                variant="light"
              >
                ${t.valor_total?.toLocaleString() || 0}
              </Badge>
            </Group>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
};

export default Finanzas;
