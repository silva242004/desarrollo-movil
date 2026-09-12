import { useState } from 'react'
import { USUARIO_FIJO } from '../data/mockData'
import { guardarSesion } from '../utils/storage'

interface Props {
  onLoginExitoso: () => void
}

// Login con usuario fijo (sin backend). Si las credenciales son correctas,
// la sesión se guarda en localStorage; si no, se muestra un mensaje de error.
const Login: React.FC<Props> = ({ onLoginExitoso }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (email.trim().toLowerCase() === USUARIO_FIJO.email && password === USUARIO_FIJO.password) {
      guardarSesion({ loggedIn: true, email: USUARIO_FIJO.email })
      setError('')
      onLoginExitoso()
      return
    }

    setError('Correo o contraseña incorrectos.')
  }

  return (
    <div className="pantalla-login">
      <div className="tarjeta-login">
        <img src="/icons/icon-192.png" alt="MediClinic" className="logo-login" />
        <h1>MediClinic</h1>
        <p className="subtitulo">Administración de pacientes</p>

        {error && <div className="error-login">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-primario">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
