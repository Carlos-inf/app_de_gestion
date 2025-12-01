import React, { useState, useMemo } from "react";
import { Modal, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconWallet } from "@tabler/icons-react"; 
import FormulariodeTrabajo from "../componentes/FormulariodeTrabajo";
import TrabajoCard from "../componentes/TrabajoCard";
import Trabajodetalle from "../componentes/Trabajodetalle";
import Finanzas from "../componentes/Finanzas";
import "./dashboard.css"; 

const Dashboard = ({ trabajos, onCreate, onUpdate, onDelete }) => {
  // --- GESTIÓN DE MODALES ---
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] =
    useDisclosure(false);
  const [updateModalOpened, { open: openUpdateModal, close: closeUpdateModal }] =
    useDisclosure(false);
  const [finanzasModalOpened, { open: openFinanzasModal, close: closeFinanzasModal }] =
    useDisclosure(false);
    
  const [trabajo_A_Actualizar, setTrabajo_A_Actualizar] = useState(null);

  // Modal DETALLE
  const [detalleAbierto, setDetalleAbierto] = useState(false);
  const [detalleTrabajo, setDetalleTrabajo] = useState(null);

  // --- LÓGICA DE DATOS ---
  // Ordenar trabajos (tu lógica se mantiene)
  const trabajosOrdenados = useMemo(() => {
    return [...trabajos].sort(
      (a, b) => new Date(a.fecha_recepcion) - new Date(b.fecha_recepcion)
    );
  }, [trabajos]);

  // Filtrar por estado
  const porHacer = trabajosOrdenados.filter((t) => t.estado_trabajo === "Por Hacer");
  const enProceso = trabajosOrdenados.filter((t) => t.estado_trabajo === "En Proceso");
  const terminado = trabajosOrdenados.filter((t) => t.estado_trabajo === "Terminado");

  // --- HANDLERS ---

  const handleCreate = (data) => {
    onCreate(data);
    closeCreateModal();
  };

  const handleActualizacion = (trabajo) => {
    setTrabajo_A_Actualizar(trabajo);
    openUpdateModal();
  };

  
  const handleUpdateSave = async (datos) => {
    // Utilizamos 'await' y el valor de retorno de onUpdate (en App.js)
    const success = await onUpdate(datos.id, datos); 
    if (success) {
        closeUpdateModal();
    }
  };

  const handleVerDetalle = (trabajo) => {
    setDetalleTrabajo(trabajo);
    setDetalleAbierto(true);
  };

  // --- LÓGICA DE DRAG AND DROP (D&D) ---

  // Al iniciar el arrastre, guarda el ID del trabajo arrastrado.
  const onDragStart = (e, trabajoId) => {
    e.dataTransfer.setData("trabajoId", trabajoId);
  };

  // Evita el comportamiento por defecto para permitir soltar.
  const onDragOver = (e) => {
    e.preventDefault();
  };

  // HANDLER CRÍTICO: Se ejecuta al soltar la tarjeta en una columna.
  const handleMoveTrabajo = (e, nuevoEstado) => {
    e.preventDefault();
    const idStr = e.dataTransfer.getData("trabajoId");
    // El ID que viene de setData es una cadena. Asegúrate de que sea un número.
    const trabajoId = parseInt(idStr); 

    // 1. Buscar el trabajo completo para obtener sus datos actuales
    const trabajoAMover = trabajos.find(t => t.id === trabajoId);

    if (trabajoAMover && trabajoId) {
        const datosActualizados = {
            // No es necesario copiar el objeto completo, solo el campo que cambia
            estado_trabajo: nuevoEstado, 
        };
        
        // LLAMADA A LA API CON EL ID NUMÉRICO CORRECTO
        onUpdate(trabajoId, datosActualizados);
    } else {
        console.error("Error en D&D: No se encontró el ID numérico para actualizar.");
    }
  };
  
  // --- RENDERING ---
  const columnData = [
    { title: "Por Hacer", data: porHacer, state: "Por Hacer", color: "#E57373" },
    { title: "En Proceso", data: enProceso, state: "En Proceso", color: "#DCE775" },
    { title: "Terminado", data: terminado, state: "Terminado", color: "#4DB6AC" },
  ];

  return (
    <div className="dashboard-container">
        
      {/* ENCABEZADO Y BOTONES */}
      <h2>Gestión de Trabajos</h2>
      <Group mb="lg">
        <Button
          onClick={openCreateModal}
          leftSection={<IconPlus size={16} />}
          color="blue"
        >
          Agregar Nuevo Trabajo
        </Button>
        <Button
          onClick={openFinanzasModal}
          leftSection={<IconWallet size={16} />}
          variant="default"
        >
          Ver Finanzas
        </Button>
      </Group>

      <hr/>

      {/* Modales (Mantenidos igual) */}

      {/* Modal UPDATE */}
      <Modal
        opened={updateModalOpened}
        onClose={closeUpdateModal}
        title="Editar Trabajo"
        size="lg"
      >
        {trabajo_A_Actualizar && (
          <FormulariodeTrabajo
            initialData={trabajo_A_Actualizar}
            onSave={handleUpdateSave}
            onCancel={closeUpdateModal}
          />
        )}
      </Modal>

      {/* Modal DETALLE */}
      <Modal
        opened={detalleAbierto}
        onClose={() => setDetalleAbierto(false)}
        title="Detalles del Trabajo"
        size="lg"
      >
        {detalleTrabajo && (
          <Trabajodetalle 
            trabajo={detalleTrabajo}
            // NO PASAR opened/onClose aquí. El Modal ya las maneja.
            onUpdate={onUpdate} 
          />
        )}
      </Modal>

      {/* Modal CREATE (Mantenido igual) */}
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Agregar Nuevo Trabajo"
        size="lg"
      >
        <FormulariodeTrabajo onSave={handleCreate} onCancel={closeCreateModal} />
      </Modal>

      {/* Modal FINANZAS (Mantenido igual) */}
      <Modal
        opened={finanzasModalOpened}
        onClose={closeFinanzasModal}
        title="Sección de Finanzas"
        size="xl"
      >
        <Finanzas trabajos={trabajos} />
      </Modal>

      {/* Tablero Kanban (Con D&D handlers) */}
      <div className="dashboard-columns">
        {columnData.map((col) => (
          <div
            key={col.title}
            className="dashboard-column"
            style={{ borderTop: `5px solid ${col.color}` }}
              // HANDLERS DE D&D EN LA COLUMNA
              onDragOver={onDragOver}
              onDrop={(e) => handleMoveTrabajo(e, col.state)} // Llama con el estado de la columna
          >
            <h3>
              {col.title} ({col.data.length})
            </h3>
            {col.data.map((trabajo) => (
              <div
                  key={trabajo.id} 
                  draggable // Hace la tarjeta arrastrable
                  onDragStart={(e) => onDragStart(e, trabajo.id)} // Pasa el ID numérico
                  style={{ cursor: 'grab' }}
              >
                <TrabajoCard
                  trabajo={trabajo}
                  onUpdate={() => handleActualizacion(trabajo)} 
                  onDelete={onDelete} 
                  onVerDetalle={() => handleVerDetalle(trabajo)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;           