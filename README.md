# Challenge 05 - Tasks con Firebase (Login/Register), Contextos y Custom Hooks

> Transform the Tasks App to add firebase Login/Register, custom hooks and
> contexts. The app must contain: Login - Register - Logout with firebase;
> routing pages: Login, Register, Tasks list, Add / Edit Task, Task Detail;
> Use one context to handle Tasks data through pages; Use another context to
> handle login and Register data; Use custom hooks to handle Firebase logic.

Requisitos y donde quedaron resueltos:

- **Login, Register y Logout con Firebase** -> `signInWithEmailAndPassword`,
  `createUserWithEmailAndPassword` y `signOut` en
  `src/hooks/useFirebaseAuth.ts`. Las pantallas son `src/pages/Login.tsx` y
  `src/pages/Register.tsx`; el boton Logout esta en `src/pages/TasksList.tsx`.
- **Paginas con routing** (`src/routes/AppRoutes.tsx`):
  - Login -> `/login`
  - Register -> `/register`
  - Lista de tareas -> `/tasks` (`src/pages/TasksList.tsx`)
  - Agregar / Editar tarea -> `/tasks/new` y `/tasks/:id/edit`, una sola
    pagina para las dos cosas (`src/pages/TaskFormPage.tsx`)
  - Detalle de tarea -> `/tasks/:id` (`src/pages/TaskDetail.tsx`, dynamic
    routing con `useParams`, Clase 04)
  - Las paginas de tareas estan protegidas (`PrivateRoute`): sin sesion
    redirigen a `/login`. Login y Register redirigen a la lista si ya hay
    sesion (`PublicRoute`).
- **Un contexto para los datos de Tasks** -> `src/context/TasksContext.tsx`
  (lista, obtener una, agregar, editar, completar, eliminar). Lo comparten la
  lista, el formulario y el detalle. Las tareas se guardan por usuario en
  `localStorage` (Clase 04); en el Challenge 06 pasan a la nube.
- **Otro contexto para login y registro** -> `src/context/AuthContext.tsx`
  (usuario, loading, login, register, logout).
- **Custom hooks para la logica de Firebase**:
  - `src/hooks/useFirebaseAuth.ts`: toda la logica de Firebase Auth
    (`onAuthStateChanged`, login, registro, logout, mensajes de error).
  - `src/hooks/useAuth.ts` y `src/hooks/useTasks.ts`: consumen cada contexto.

Detalles que vale la pena mencionar:

- `onAuthStateChanged` deja la sesion guardada: al recargar no se vuelve a
  pedir login. Mientras Firebase responde se muestra un spinner (si no, se ve
  un parpadeo de la pantalla de login).
- Las redirecciones usan un helper `RedirectOnce` en vez de `<Navigate>`.
  `IonRouterOutlet` deja montadas las paginas anteriores y `<Navigate>` se
  vuelve a disparar en cada cambio de ruta: al tocar "Registrarme" justo
  despues de abrir la app, el usuario rebotaba al login.

## Configurar Firebase (paso a paso)

1. Entra a https://console.firebase.google.com/ y crea un proyecto
   (puedes desactivar Google Analytics).
2. En el menu izquierdo: **Build > Authentication > Comenzar** y en
   "Sign-in method" activa **Correo electronico/contrasena**.
3. En **Configuracion del proyecto** (rueda dentada) > pestana **General** >
   **Tus apps** > icono **</>** (Web). Ponle un nombre y registra la app (no
   hace falta Hosting).
4. Copia los valores del objeto `firebaseConfig` que te muestra.
5. En esta carpeta copia `.env.example` como `.env` y pega cada valor:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

El archivo `.env` esta en `.gitignore`, no se sube al repo. (La config web de
Firebase no es un secreto, pero es buena practica no dejarla en el codigo.)
Si falta el `.env`, la app abre igual y muestra un aviso en el login.

## Como correrlo

```bash
npm install
npm run dev
```

Crea una cuenta desde "No tengo cuenta: registrarme" (password de minimo 6
caracteres). Para probar en el telefono, ver la Clase 03 (`ionic cap run
android`) o despliega con Netlify (`npm run build` y subir `dist`, con el
archivo `public/_redirects`).

## Netlify (opcional)

`public/_redirects` ya trae `/* /index.html 200` para que las rutas
funcionen al recargar.
