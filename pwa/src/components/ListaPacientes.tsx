import type { Paciente } from '../data/mockData'

interface Props {
  pacientes: Paciente[]
}

// Componente hijo: solo recibe la lista ya filtrada (por el padre) y la
// pinta. No conoce el término de búsqueda ni filtra nada por su cuenta.
const ListaPacientes: React.FC<Props> = ({ pacientes }) => {
  if (pacientes.length === 0) {
    return <p className="sin-resultados">No hay pacientes que coincidan con la búsqueda.</p>
  }

  return (
    <ul className="lista-pacientes">
      {pacientes.map((p) => (
        <li key={p.id} className="item-paciente">
          <div>
            <div className="nombre">
              {p.nombre} {p.apellido}
            </div>
            <div className="detalle">CC: {p.cc}</div>
          </div>
          <div className="detalle">{p.telefono}</div>
        </li>
      ))}
    </ul>
  )
}

export default ListaPacientes
