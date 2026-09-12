import { useState } from 'react'
import Login from './components/Login'
import PacientesPage from './components/PacientesPage'
import { getSesion } from './utils/storage'

const App: React.FC = () => {
  // La sesión se guarda/lee de localStorage; este estado solo evita tener
  // que releer localStorage en cada render y permite reaccionar al
  // login/logout sin recargar la página.
  const [sesionActiva, setSesionActiva] = useState(() => getSesion() !== null)

  if (!sesionActiva) {
    return <Login onLoginExitoso={() => setSesionActiva(true)} />
  }

  return <PacientesPage onLogout={() => setSesionActiva(false)} />
}

export default App
