import React, { useState, useMemo } from "react";
import { Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FormulariodeTrabajo from "../componentes/FormulariodeTrabajo";
import TrabajoCard from "../componentes/TrabajoCard";
import Trabajodetalle from "../componentes/Trabajodetalle";
import Finanzas from "../componentes/Finanzas";

const Dashboard = ({ trabajos, onCreate, onUpdate, onDelete }) => {
  // Modal CREATE 
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] =
    useDisclosure(false);

  // Modal UPDATE
  const [updateModalOpened, { open: openUpdateModal, close: closeUpdateModal }] =
    useDisclosure(false);
  const [trabajo_A_Actualizar, setTrabajo_A_Actualizar] = useState(null);

  // Modal DETALLE
  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [detalleTrabajo, setDetalleTrabajo] = useState(null);

  // Modal FINANZAS
  const [finanzasModalOpened, { open: openFinanzasModal, close: closeFinanzasModal }] =
    useDisclosure(false);

  // Ordenar trabajos
  const trabajosOrdenados = useMemo(() => {
    return [...trabajos].sort(
      (a, b) => new Date(a.fecha_recepcion) - new Date(b.fecha_recepcion)
    );
  }, [trabajos]);

  // Filtrar por estado
  const porHacer = trabajosOrdenados.filter((t) => t.estado_trabajo === "Por Hacer");
  const enProceso = trabajosOrdenados.filter((t) => t.estado_trabajo === "En Proceso");
  const terminado = trabajosOrdenados.filter((t) => t.estado_trabajo === "Terminado");

  // FUNCIONES
  const handleCreate = (data) => {
    onCreate(data);
    closeCreateModal();
  };

  const handleActualizacion = (trabajo) => {
    setTrabajo_A_Actualizar(trabajo);
    openUpdateModal();
  };

  const handleUpdateSave = (datos) => {
    onUpdate(datos.id_trabajo, datos);
    closeUpdateModal();
  };

  const handleVerDetalle = (trabajo) => {
    setDetalleTrabajo(trabajo);
    setDetalleAbierto(true);
  };

  // RENDER COLUMNA
  const renderColumn = (title, works, color) => (
    <div
      key={title}
      style={{
        width: "32%",
        minHeight: "500px",
        padding: "15px",
        borderRadius: "12px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        borderTop: `5px solid ${color}`,
      }}
    >
      <h3
        style={{
          borderBottom: "2px solid #F0F0F0",
          paddingBottom: "10px",
          margin: "0 0 15px 0",
          fontSize: "18px",
          color: "#1A237E",
          fontWeight: "600",
        }}
      >
        {title} ({works.length})
      </h3>
      {works.map((trabajo) => (
        <TrabajoCard
          key={trabajo.id_trabajo}
          trabajo={trabajo}
          onDelete={onDelete}
          onUpdate={() => handleActualizacion(trabajo)}
          onVerDetalle={() => handleVerDetalle(trabajo)}
        />
      ))}
    </div>
  );

  const columnData = [
    { title: "Por Hacer", data: porHacer, color: "#E57373" },
    { title: "En Proceso", data: enProceso, color: "#DCE775" },
    { title: "Terminado", data: terminado, color: "#4DB6AC" },
  ];

  // RENDER
  return (
    <div
      style={{
        padding: "30px",
        background: "linear-gradient(180deg, #F5F7FA 0%, #ECEFF1 100%)",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Encabezado principal */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            color: "#1e289aff",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Agenda de Modista
        </h1>

        <Button
          onClick={openCreateModal}
          style={{
            backgroundColor: "#0E9D58",
            color: "white",
            fontWeight: "500",
            borderRadius: "10px",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 10px rgba(14,157,88,0.3)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          + Agregar Nuevo Trabajo
        </Button>

        <Button
          onClick={openFinanzasModal}
          style={{
            backgroundColor: "#2530abff",
            color: "white",
            fontWeight: "500",
            borderRadius: "10px",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 10px rgba(26,35,126,0.3)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          Finanzas
        </Button>
      </div>

      {/* Modal FINANZAS */}
      <Modal
        opened={finanzasModalOpened}
        onClose={closeFinanzasModal}
        title="Sección de Finanzas"
        size="xl"
      >
        <Finanzas trabajos={trabajos} />
      </Modal>

      {/* Modal CREATE */}
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Ingresar Nuevo Trabajo"
        size="lg"
      >
        <FormulariodeTrabajo
          onSave={handleCreate}
          onCancel={closeCreateModal}
          initialData={{}}
        />
      </Modal>

      {/* Modal UPDATE */}
      {trabajo_A_Actualizar && (
        <Modal
          opened={updateModalOpened}
          onClose={closeUpdateModal}
          title={`Editar ${trabajo_A_Actualizar.nombre_trabajo}`}
          size="lg"
        >
          <FormulariodeTrabajo
            onSave={handleUpdateSave}
            onCancel={closeUpdateModal}
            initialData={trabajo_A_Actualizar}
          />
        </Modal>
      )}

      {/* Modal DETALLE */}
      {detalleTrabajo && (
        <Trabajodetalle
          trabajo={detalleTrabajo}
          opened={detalleAbierto}
          onClose={() => setDetalleAbierto(false)}
          onUpdate={onUpdate}
        />
      )}

      {/* Estilo Kanban */}
      <div
        style={{
          display: "flex",
          gap: "25px",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {columnData.map((col) => renderColumn(col.title, col.data, col.color))}
      </div>
    </div>
  );
};

export default Dashboard;
