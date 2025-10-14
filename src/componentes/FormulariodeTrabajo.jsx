import React, { useState, useEffect } from "react";

const FormulariodeTrabajo = ({ onSave, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    id_trabajo: initialData.id_trabajo || null,
    nombre_trabajo: initialData.nombre_trabajo || "",
    nombre_cliente: initialData.nombre_cliente || "",
    telefono_cliente: initialData.telefono_cliente || "",
    cantidad_piezas: initialData.cantidad_piezas || 1,
    fecha_recepcion: initialData.fecha_recepcion || "",
    fecha_entrega_estimada: initialData.fecha_entrega_estimada || "",
    valor_total: initialData.valor_total || "",
    abono_recibido: initialData.abono_recibido || "",
    estado_trabajo: initialData.estado_trabajo || "Por Hacer",
    detalle_general: initialData.detalle_general || "",
    medidas: initialData.medidas || {},
    imagen_url: initialData.imagen_url || "",
  });

  // Actualiza si cambian los datos iniciales
  useEffect(() => {
    // Función auxiliar para formatear fechas correctamente
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      // Corrige el desfase por zona horaria
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return local.toISOString().split("T")[0];
    };

    setFormData({
      id_trabajo: initialData.id_trabajo || null,
      nombre_trabajo: initialData.nombre_trabajo || "",
      nombre_cliente: initialData.nombre_cliente || "",
      telefono_cliente: initialData.telefono_cliente || "",
      cantidad_piezas: initialData.cantidad_piezas || 1,

      fecha_recepcion: formatDate(initialData.fecha_recepcion),
      fecha_entrega_estimada: formatDate(initialData.fecha_entrega_estimada),

      valor_total:
        initialData.valor_total !== undefined &&
        initialData.valor_total !== null &&
        initialData.valor_total !== 0
          ? initialData.valor_total
          : "",

      abono_recibido: initialData.abono_recibido || "",
      estado_trabajo: initialData.estado_trabajo || "Por Hacer",
      detalle_general: initialData.detalle_general || "",
      medidas: initialData.medidas || {},
    });
  }, [initialData]);

  // --- Manejador de cambios ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "valor_total" ||
        name === "abono_recibido" ||
        name === "cantidad_piezas"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // Guardar
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre_trabajo.trim()) {
      alert("El nombre del trabajo es obligatorio.");
      return;
    }
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <label>Nombre del Trabajo</label>
      <input
        name="nombre_trabajo"
        value={formData.nombre_trabajo}
        onChange={handleChange}
        required
      />

      <label>Nombre del Cliente</label>
      <input
        name="nombre_cliente"
        value={formData.nombre_cliente}
        onChange={handleChange}
        required
      />

      <label>Teléfono del Cliente</label>
      <input
        name="telefono_cliente"
        value={formData.telefono_cliente}
        onChange={handleChange}
        required
      />

      <label>Cantidad de Piezas</label>
      <input
        type="number"
        name="cantidad_piezas"
        value={formData.cantidad_piezas}
        onChange={handleChange}
        min="1"
        required
      />

      <label>Fecha de Recepción</label>
      <input
        type="date"
        name="fecha_recepcion"
        value={formData.fecha_recepcion}
        onChange={handleChange}
        required
      />

      <label>Fecha de Entrega Estimada</label>
      <input
        type="date"
        name="fecha_entrega_estimada"
        value={formData.fecha_entrega_estimada}
        onChange={handleChange}
        required
      />

      <label>Valor Total ($)</label>
      <input
        type="number"
        name="valor_total"
        value={formData.valor_total}
        onChange={handleChange}
        required
      />

      <label>Abono Recibido ($)</label>
      <input
        type="number"
        name="abono_recibido"
        value={formData.abono_recibido}
        onChange={handleChange}
        required
      />

      <label>Estado del Trabajo</label>
      <select
        name="estado_trabajo"
        value={formData.estado_trabajo}
        onChange={handleChange}
        required
      >
        <option value="Por Hacer">Por Hacer</option>
        <option value="En Proceso">En Proceso</option>
        <option value="Terminado">Terminado</option>
      </select>

      <label>Detalle General</label>
      <textarea
        name="detalle_general"
        value={formData.detalle_general}
        onChange={handleChange}
      />

      <label>Imagen del Trabajo (URL)</label>
      <input
        type="text"
        name="imagen_url"
        value={formData.imagen_url}
        onChange={handleChange}
        placeholder="Ej: https://miimagen.com/foto.jpg"
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
};

export default FormulariodeTrabajo;
