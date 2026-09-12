import { useMemo, useState } from 'react'
import type { Paciente } from '../data/mockData'
import { cerrarSesion, getPacientes, guardarPacientes } from '../utils/storage'
import Buscador from './Buscador'
import PacienteForm from './PacienteForm'
import ListaPacientes from './ListaPacientes'

interface Props {
  onLogout: () => void
}

// Componente PADRE: acá vive el estado del buscador y la lista completa de
// pacientes. La lista filtrada se calcula acá y se le pasa como prop al
// componente hijo (ListaPacientes), que solo la muestra.
const PacientesPage: React.FC<Props> = ({ onLogout }) => {
  const [pacientes, setPacientes] = useState<Paciente[]>(() => getPacientes())
  const [busqueda, setBusqueda] = useState('')

  const pacientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return pacientes

    return pacientes.filter(
      (p) =>
        p.nombre.toLowerCase().includes(termino) ||
        p.apellido.toLowerCase().includes(termino) ||
        p.cc.toLowerCase().includes(termino),
    )
  }, [pacientes, busqueda])

  const agregarPaciente = (datos: { nombre: string; apellido: string; cc: string; telefono: string }) => {
    const nuevo: Paciente = { id: crypto.randomUUID(), ...datos }
    const actualizados = [...pacientes, nuevo]
    setPacientes(actualizados)
    guardarPacientes(actualizados)
  }

  const handleLogout = () => {
    cerrarSesion()
    onLogout()
  }

  return (
    <div>
      <header className="encabezado-app">
        <h1>MediClinic - Pacientes</h1>
        <button className="btn-secundario" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main className="contenedor">
        <PacienteForm onAgregar={agregarPaciente} />
        <Buscador valor={busqueda} onChange={setBusqueda} />
        <ListaPacientes pacientes={pacientesFiltrados} />
      </main>
    </div>
  )
}

export default PacientesPage
