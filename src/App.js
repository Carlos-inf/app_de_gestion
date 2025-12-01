import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Dashboard from './pages/dashboard';

const API_URL = 'http://127.0.0.1:8000/api/trabajos';

function App() {
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ----------------------------------------------------
    // Carga Inicial (GET)
    // ----------------------------------------------------
    const fetchTrabajos = useCallback(async () => {
        setLoading(true);
        try {
            // Petición GET a Laravel
            const response = await axios.get(API_URL);
            setTrabajos(response.data);
            setError(null);
        } catch (err) {
            console.error("Error al obtener trabajos:", err);
            setError("Error al cargar datos. ¿Está el servidor Laravel corriendo?");
            setTrabajos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrabajos();
    }, [fetchTrabajos]); // Llama a fetchTrabajos al montar

    // ----------------------------------------------------
    // Ordenamiento (useMemo se mantiene, pero ahora sobre la lista API)
    // ----------------------------------------------------
    const trabajosOrdenados = useMemo(() => {
    return [...trabajos].sort((a, b) => {
        // Asigna una fecha muy temprana si el campo es nulo o inválido
        const dateA = a.fecha_recepcion ? new Date(a.fecha_recepcion) : new Date(0);
        const dateB = b.fecha_recepcion ? new Date(b.fecha_recepcion) : new Date(0);
        
        // La fecha más temprana (dateA o dateB) se moverá al inicio de la lista.
        return dateA - dateB;
    });
}, [trabajos]);

    // ----------------------------------------------------
    // 1. Creación (POST)
    // ----------------------------------------------------
    const crearTrabajo = async (nuevoTrabajo) => {
        try {
            // Envía el objeto de trabajo (Laravel lo valida y crea el ID)
            const response = await axios.post(API_URL, nuevoTrabajo);
            
            // Añade el trabajo creado (con ID real del DB) al estado
            setTrabajos(prev => [...prev, response.data]); 
            return true; // Éxito
        } catch (err) {
            console.error("Error en crearTrabajo:", err.response ? err.response.data : err);
            alert("Error al crear. Revise la consola para errores de validación.");
            return false; // Fallo
        }
    };

    // ----------------------------------------------------
    // 2. Actualización (PATCH)
    // ----------------------------------------------------
    const actualizarTrabajo = async (id_a_editar, datosActualizados) => {
        if (!id_a_editar) {
        console.error("Error: ID del trabajo es nulo o indefinido para la actualización.");
        alert("Error al actualizar: Falta el ID del trabajo.");
        return false; 
    }
        try {
        const response = await axios.patch(`${API_URL}/${id_a_editar}`, datosActualizados);

        // Actualiza el estado
        setTrabajos(prevTrabajos => prevTrabajos.map(t => 
            t.id === id_a_editar ? response.data : t
        ));
        return true;
    } catch (err) {
        console.error("Error en actualizarTrabajo:", err.response ? err.response.data : err);
        alert("Error al actualizar. Revise la consola.");
        return false;
    }
    };

    // ----------------------------------------------------
    // 3. Eliminación (DELETE)
    // ----------------------------------------------------
    const borrarTrabajo = async (id_a_eliminar) => {
        if (!window.confirm(`¿Seguro que quieres eliminar el trabajo ${id_a_eliminar}?`)) {
            return false;
        }

        try {
            // Petición DELETE al endpoint: /api/trabajos/{id}
            await axios.delete(`${API_URL}/${id_a_eliminar}`);

            // Filtra el trabajo eliminado del estado de React
            setTrabajos(prevTrabajos => prevTrabajos.filter(t => t.id !== id_a_eliminar));
            alert("Trabajo eliminado con éxito.");
            return true; // Éxito
        } catch (err) {
            console.error("Error en borrarTrabajo:", err);
            alert("Error al eliminar el trabajo.");
            return false; // Fallo
        }
    };

    // Si estás cargando o hay un error fatal
    if (loading) return <div className='App'>Cargando datos del servidor...</div>;
    if (error) return <div className='App' style={{color: 'red'}}>ERROR: {error}</div>;


    return (
        <div className='App'>
            <Dashboard
                trabajos={trabajosOrdenados}
                onCreate={crearTrabajo}
                onUpdate={actualizarTrabajo}
                onDelete={borrarTrabajo}
            />
        </div>
    );
}

export default App;