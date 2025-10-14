import React, {useState, useMemo} from 'react';
import trabajosIniciales from './data/datos_iniciales.json';
import { calcularDatos } from './herramientas/calculos';
import Dashboard from './pages/dashboard';


function App() {
  const [trabajos, setTrabajos] = useState(
    ()=>trabajosIniciales.map(calcularDatos)
  );

  const trabajosOrdenados = useMemo(()=> {
    return[...trabajos].sort((a,b) => {
      return new Date(a.fecha_recepcion) - new Date(b.fecha_recepcion);
    });
  }, [trabajos]);

  //Creacion de trabajos
  const crearTrabajo = (nuevoTrabajo) => {
    const nuevoId = `T-${(trabajos.length + 1).toString().padStart(3, '0')}`;
    const trabajoId = { ...nuevoTrabajo, id_trabajo: nuevoId};

    const trabajoFinal = calcularDatos(trabajoId);
    setTrabajos(prev => [...prev, trabajoFinal]);
  };

  //Actualizacion de trabajos
  const actualizarTrabajo = (ID_a_editar, datosActualizados) => {
    setTrabajos(prevTrabajos => prevTrabajos.map(t => {
      if (t.id_trabajo === ID_a_editar) {
        const datos_editados = {...t, ...datosActualizados};
        return calcularDatos(datos_editados);
      }
      return t;
    }));
  };

  const borrarTrabajo = (ID_a_eliminar)=> {
    setTrabajos(prevTrabajos => prevTrabajos.filter(t => t.id_trabajo !== ID_a_eliminar));
  };

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
