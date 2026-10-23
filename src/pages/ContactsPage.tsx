import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IonAlert,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import PageShell from '../components/PageShell';
import NetworkBanner from '../components/NetworkBanner';
import { useAuth } from '../hooks/useAuth';
import { useCollection } from '../hooks/useCollection';
import { useNetwork } from '../hooks/useNetwork';
import type { Contact } from '../types';

type ContactData = Omit<Contact, 'id'>;

// Contactos guardados en Firebase Firestore, uno por usuario (campo uid).
// Sin conexion todas las acciones quedan deshabilitadas.
function ContactsPage() {
  const { user } = useAuth();
  const uid = user?.uid ?? '';
  const { connected } = useNetwork();
  const { items, loading, error, add, update, remove, refresh } = useCollection<ContactData>(
    'contacts',
    [['uid', '==', uid]],
  );

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Contact | null>(null);

  // Al volver la conexion se recargan los datos.
  const wasOffline = useRef(false);
  useEffect(() => {
    if (!connected) wasOffline.current = true;
    else if (wasOffline.current) {
      wasOffline.current = false;
      refresh();
    }
  }, [connected, refresh]);

  const contacts = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
    } catch {
      setMessage('No se pudo completar la accion. Revisa tu conexion y las reglas de Firestore.');
    } finally {
      setBusy(false);
    }
  };

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) {
      setMessage('Escribe el nombre y el telefono');
      return;
    }
    run(async () => {
      await add({ name: name.trim(), phone: phone.trim(), uid });
      setName('');
      setPhone('');
    });
  };

  return (
    <PageShell title="Contactos (Firestore)">
      <NetworkBanner connected={connected} />

      <IonItem>
        <IonInput
          label="Nombre"
          labelPlacement="floating"
          value={name}
          disabled={!connected}
          onIonInput={(e) => setName(e.detail.value ?? '')}
        />
      </IonItem>
      <IonItem>
        <IonInput
          label="Telefono"
          labelPlacement="floating"
          type="tel"
          value={phone}
          disabled={!connected}
          onIonInput={(e) => setPhone(e.detail.value ?? '')}
        />
      </IonItem>
      <IonButton
        expand="block"
        className="ion-margin-top"
        disabled={!connected || busy}
        onClick={handleAdd}
      >
        Agregar contacto
      </IonButton>

      {message && (
        <IonText color="danger">
          <p>{message}</p>
        </IonText>
      )}
      {error && (
        <IonText color="warning">
          <p>No se pudieron cargar los contactos: {error}</p>
        </IonText>
      )}

      {loading ? (
        <div className="ion-text-center ion-padding">
          <IonSpinner name="crescent" />
        </div>
      ) : contacts.length === 0 ? (
        <p className="ion-text-center">Aun no tienes contactos.</p>
      ) : (
        <IonList>
          {contacts.map((c) => (
            <IonItem key={c.id}>
              <IonLabel>
                <h2>{c.name}</h2>
                <p>{c.phone}</p>
              </IonLabel>
              <IonButton
                slot="end"
                fill="clear"
                aria-label={`Editar ${c.name}`}
                disabled={!connected || busy}
                onClick={() => setEditing(c)}
              >
                <IonIcon icon={createOutline} slot="icon-only" />
              </IonButton>
              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                aria-label={`Eliminar ${c.name}`}
                disabled={!connected || busy}
                onClick={() => run(() => remove(c.id))}
              >
                <IonIcon icon={trashOutline} slot="icon-only" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}

      <IonAlert
        isOpen={editing !== null}
        header="Editar contacto"
        inputs={[
          { name: 'name', type: 'text', value: editing?.name, placeholder: 'Nombre' },
          { name: 'phone', type: 'tel', value: editing?.phone, placeholder: 'Telefono' },
        ]}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Guardar',
            handler: (data: { name: string; phone: string }) => {
              if (editing && data.name.trim() && data.phone.trim()) {
                run(() => update(editing.id, { name: data.name.trim(), phone: data.phone.trim() }));
              }
            },
          },
        ]}
        onDidDismiss={() => setEditing(null)}
      />
    </PageShell>
  );
}

export default ContactsPage;
