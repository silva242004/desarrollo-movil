# Challenge - Clase 01 (Refuerzo JavaScript)

Consigna del profesor:
1. Investigar la diferencia entre Arrow Functions y Regular Functions.
2. Crear una funcion de cada tipo que reciba un numero y muestre en
   consola si es par o impar.

## Diferencias investigadas (resumen)

- **this**: en una regular function, `this` depende de como se llama la
  funcion (puede cambiar con `call/apply/bind`). En una arrow function,
  `this` es el del contexto donde se definio (this lexico); no tiene uno
  propio.
- **arguments**: las regular functions tienen el objeto `arguments`; las
  arrow functions no, hay que usar rest params (`...args`).
- **Constructor**: una regular function se puede usar con `new`; una
  arrow function no (lanza error).
- **Hoisting**: una `function nombre(){}` se puede llamar antes de su
  definicion; una arrow function asignada a `const`/`let` no.
- **Sintaxis**: la arrow function es mas corta y permite omitir
  `return`/llaves cuando el cuerpo es una sola expresion.

