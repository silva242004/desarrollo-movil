import { useState } from 'react';
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
import { DuplicateFruitError, useDexie } from '../hooks/useDexie';
import { useNetwork } from '../hooks/useNetwork';
import type { Fruit } from '../db/fruitsDb';

// Frutas en Dexie (IndexedDB): datos locales, por eso NO se deshabilitan
// las acciones cuando no hay conexion. La lista se actualiza sola con
// useLiveQuery.
function FruitsPage() {
  const { connected } = useNetwork();
  const { fruits, loading, add, update, remove } = useDexie();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Fruit | null>(null);

  const handleAdd = async () => {
    const value = Number(price);
    if (!name.trim() || price.trim() === '' || Number.isNaN(value) || value < 0) {
      setMessage('Escribe un nombre y un precio valido');
      return;
    }
    try {
      await add(name.trim(), value);
      setName('');
      setPrice('');
      setMessage(null);
    } catch (e) {
      // El indice &name es unico: no se pueden repetir nombres.
      setMessage(
        e instanceof DuplicateFruitError
          ? 'Ya existe una fruta con ese nombre'
          : 'No se pudo guardar la fruta',
      );
    }
  };

  return (
    <PageShell title="Frutas (Dexie)">
      <NetworkBanner connected={connected} gated={false} />

      <IonItem>
        <IonInput
          label="Fruta"
          labelPlacement="floating"
          value={name}
          onIonInput={(e) => {
            setName(e.detail.value ?? '');
            setMessage(null);
          }}
        />
      </IonItem>
      <IonItem>
        <IonInput
          label="Precio"
          labelPlacement="floating"
          type="number"
          value={price}
          onIonInput={(e) => {
            setPrice(e.detail.value ?? '');
            setMessage(null);
          }}
        />
      </IonItem>
      <IonButton expand="block" className="ion-margin-top" onClick={handleAdd}>
        Agregar fruta
      </IonButton>

      {message && (
        <IonText color="danger">
          <p>{message}</p>
        </IonText>
      )}

      {loading ? (
        <div className="ion-text-center ion-padding">
          <IonSpinner name="crescent" />
        </div>
      ) : fruits.length === 0 ? (
        <p className="ion-text-center">No hay frutas guardadas.</p>
      ) : (
        <IonList>
          {fruits.map((f) => (
            <IonItem key={f.id}>
              <IonLabel>
                <h2>{f.name}</h2>
                <p>${f.price.toLocaleString()}</p>
              </IonLabel>
              <IonButton
                slot="end"
                fill="clear"
                aria-label={`Editar ${f.name}`}
                onClick={() => setEditing(f)}
              >
                <IonIcon icon={createOutline} slot="icon-only" />
              </IonButton>
              <IonButton
                slot="end"
                fill="clear"
                color="danger"
                aria-label={`Eliminar ${f.name}`}
                onClick={() => remove(f.id)}
              >
                <IonIcon icon={trashOutline} slot="icon-only" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}

      <IonAlert
        isOpen={editing !== null}
        header={editing ? `Precio de ${editing.name}` : ''}
        inputs={[{ name: 'price', type: 'number', value: editing?.price, placeholder: 'Precio' }]}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Guardar',
            handler: (data: { price: string }) => {
              const value = Number(data.price);
              if (editing && data.price !== '' && !Number.isNaN(value) && value >= 0) {
                update(editing.id, { price: value });
              }
            },
          },
        ]}
        onDidDismiss={() => setEditing(null)}
      />
    </PageShell>
  );
}

export default FruitsPage;
