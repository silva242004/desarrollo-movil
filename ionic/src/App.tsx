import { Navigate, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

import Login from './pages/Login/Login'
import TabsLayout from './pages/TabsLayout'
import { getSesion } from './utils/storage'

setupIonicReact()

// Estos dos "guardias" son componentes (no un ternario inline) a propósito:
// así React vuelve a leer localStorage cada vez que la ruta se vuelve a
// montar (por ejemplo justo después del login o del logout).
const RutaTabs: React.FC = () => (getSesion() ? <TabsLayout /> : <Navigate to="/login" replace />)
const RutaRaiz: React.FC = () => <Navigate to={getSesion() ? '/tabs/visitas' : '/login'} replace />

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/login" element={<Login />} />

        {/* Todo lo que empieza por /tabs exige sesión iniciada. */}
        <Route path="/tabs/*" element={<RutaTabs />} />

        <Route path="/" element={<RutaRaiz />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App
