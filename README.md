# Challenge 04 - Login Demo (Ionic)


> Create a new Demo Login Page in ionic. It should contain: Email,
> Password, Button to Login. When the button is clicked, validate if the
> user is user@mail.com / password: 123. In that case, store a token
> called logged = true and redirect to List page. Next time we enter to
> the app, check if the user is logged, then it's not necessary to
> log-in again. Create a button to logout, then when the button is
> clicked, the app will clean the token and redirect to login page.

Requisitos y donde quedaron resueltos:
- Email / password / boton de login -> `src/pages/Login.tsx`.
- Validacion contra `user@mail.com` / `123` -> constantes
  `VALID_EMAIL` / `VALID_PASSWORD` en `Login.tsx`; si fallan se muestra
  un `IonToast` con el error.
- Guardar token `logged = true` y redirigir a la lista -> funcion
  `setLoggedIn()` en `src/utils/auth.ts`, seguida de
  `router.push('/list', 'forward')` (hook `useIonRouter`, como se
  menciono en la Clase 04).
- No pedir login de nuevo si ya esta logueado -> en `src/App.tsx`, la
  ruta `/` redirige a `/list` o `/login` segun `isLoggedIn()`, y
  `PrivateRoute` protege `/list` por si se intenta entrar directo sin
  sesion.
- Boton de logout que limpia el token y redirige a login ->
  `src/pages/ListPage.tsx`, funcion `logout()` de `auth.ts` +
  `router.navigateRoot('/login')` (limpia el historial de navegacion).




`user@mail.com` / `123`

