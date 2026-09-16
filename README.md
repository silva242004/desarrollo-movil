# Challenge 03 - Task Manager (Ionic)


> Create a new Task Manager app in ionic. It should contain: states and
> effects, if it's necessary. Child and parent components - at least 3
> components. View a task list. Add new tasks. Mark tasks as completed.
> Delete tasks.

Requisitos y donde quedaron resueltos:
- Estados y efectos -> `src/pages/TaskManagerPage.tsx` (estado `tasks`,
  `useEffect` simulando una carga inicial).
- Componentes padre/hijo (mas de 3) -> `TaskManagerPage` (padre) +
  `TaskForm`, `TaskList`, `TaskItem` (hijos).
- Ver lista de tareas -> `TaskList` con `IonList`/`IonItem`.
- Agregar tareas -> `TaskForm` con `IonInput` + `IonButton`.
- Marcar como completadas -> `IonCheckbox` en `TaskItem`.
- Eliminar tareas -> boton con icono de basura en `TaskItem`.

Solo se usan componentes de Ionic (IonApp, IonPage, IonHeader,
IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput,
IonCheckbox, IonButton, IonIcon, IonSpinner).



## Instalar en el celular (Android/iOS) - pasos manuales

 (necesita Android Studio/Xcode y tu
telefono conectado por USB)

```bash
npm i -g @ionic/cli      
npm install --save @capacitor/core @capacitor/android
npx cap init
npx cap add android
ionic cap run android
```

