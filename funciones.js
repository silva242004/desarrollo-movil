/**
 * Challenge - Clase 01 (Refuerzo JavaScript)
 * 1) Investigar diferencia entre Arrow Functions y Regular Functions.
 * 2) Crear una funcion de cada tipo que reciba un numero y
 *    muestre en consola si es par o impar.
 */

// ---- Regular function ----
function esParImparRegular(numero) {
  if (numero % 2 === 0) {
    console.log(`[Regular] ${numero} es PAR`);
  } else {
    console.log(`[Regular] ${numero} es IMPAR`);
  }
}

// ---- Arrow function ----
const esParImparArrow = (numero) => {
  if (numero % 2 === 0) {
    console.log(`[Arrow] ${numero} es PAR`);
  } else {
    console.log(`[Arrow] ${numero} es IMPAR`);
  }
};

// Pruebas
[4, 7, 10, 15, 0, -3].forEach((n) => {
  esParImparRegular(n);
  esParImparArrow(n);
});
