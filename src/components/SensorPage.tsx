import type { ReactNode } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

interface Props {
  title: string;
  // Que plugin de Capacitor usa la pagina.
  plugin: string;
  children: ReactNode;
}

// Estructura comun de las paginas de sensores: header con boton atras,
// el nombre del plugin y el contenido.
function SensorPage({ title, plugin, children }: Props) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonNote>{plugin}</IonNote>
        {children}
      </IonContent>
    </IonPage>
  );
}

export default SensorPage;
