import { useState } from 'react'
import type { ErroresPaciente } from '../utils/validacion'
import { validarPaciente } from '../utils/validacion'

interface Props {
  onAgregar: (datos: { nombre: string; apellido: string; cc: string; telefono: string }) => void
}

// Formulario para agregar un paciente. Valida nombre, apellido y CC antes
// de avisarle al padre (PacientesPage) que agregue el paciente.
const PacienteForm: React.FC<Props> = ({ onAgregar }) => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [cc, setCc] = useState('')
  const [telefono, setTelefono] = useState('')
  const [errores, setErrores] = useState<ErroresPaciente>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const erroresEncontrados = validarPaciente({ nombre, apellido, cc })
    setErrores(erroresEncontrados)
    if (Object.keys(erroresEncontrados).length > 0) return

    onAgregar({ nombre: nombre.trim(), apellido: apellido.trim(), cc: cc.trim(), telefono: telefono.trim() })

    setNombre('')
    setApellido('')
    setCc('')
    setTelefono('')
    setErrores({})
  }

  return (
    <div className="tarjeta-formulario">
      <h2>Agregar paciente</h2>
      <form onSubmit={handleSubmit}>
        <div className="fila-formulario">
          <div className="campo">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              className={errores.nombre ? 'con-error' : ''}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && <div className="error-texto">{errores.nombre}</div>}
          </div>
          <div className="campo">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              className={errores.apellido ? 'con-error' : ''}
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            {errores.apellido && <div className="error-texto">{errores.apellido}</div>}
          </div>
          <div className="campo">
            <label htmlFor="cc">CC</label>
            <input id="cc" className={errores.cc ? 'con-error' : ''} value={cc} onChange={(e) => setCc(e.target.value)} />
            {errores.cc && <div className="error-texto">{errores.cc}</div>}
          </div>
          <div className="campo">
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn-primario">
          Agregar paciente
        </button>
      </form>
    </div>
  )
}

export default PacienteForm
