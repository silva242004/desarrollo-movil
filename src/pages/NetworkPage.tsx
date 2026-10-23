import SensorPage from '../components/SensorPage';
import Result from '../components/Result';
import { useNetwork } from '../hooks/useNetwork';

function NetworkPage() {
  const { connected, connectionType } = useNetwork();

  return (
    <SensorPage title="Network" plugin="@capacitor/network">
      <p>Activa y desactiva el wifi o los datos: el estado cambia solo.</p>
      <Result data={{ connected, connectionType }} />
    </SensorPage>
  );
}

export default NetworkPage;
