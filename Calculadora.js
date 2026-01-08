const screen = document.getElementById("pantalla");
const buttons = document.querySelectorAll(".boton");
const historialDiv = document.getElementById("historial");

let cadenaOper = "";
let res = 0;
let historial = [];
if (localStorage.getItem("historialCalc")) {
  historial = JSON.parse(localStorage.getItem("historialCalc"));
  actualizarHistorial();
}

const valorNumerico = "0123456789.";
const valorOperacion = "+-*/";

function actualizarHistorial() {
  historialDiv.innerHTML = historial
    .map((item) => `<div>${item}</div>`)
    .reverse()
    .join("");
  localStorage.setItem("historialCalc", JSON.stringify(historial));
}

function validarCadena(cadena) {
  let esValida = true;
  let contadorPuntos = 0;
  for (let i = 0; i < cadena.length; i++) {
    if (cadena[i] === ".") {
      contadorPuntos++;
      if (contadorPuntos > 1) {
        esValida = false;
        break;
      }
    }
    if (valorOperacion.includes(cadena[i])) {
      if (valorOperacion.includes(cadena[i + 1])) {
        esValida = false;
        break;
      }
      if (contadorPuntos > 1) {
        esValida = false;
        break;
      } else {
        contadorPuntos = 0;
      }
    }
  }
  return esValida;
}

function identificarTecla(valor) {
  if (valorNumerico.includes(valor) || valorOperacion.includes(valor)) {
    cadenaOper += valor;
    screen.value = cadenaOper;
    return;
  }

  if (valor === "Enter" || valor === "=") {
    if (
      !valorOperacion.includes(cadenaOper.slice(-1)) &&
      (valorNumerico.includes(cadenaOper[0]) ||
        cadenaOper[0] === "-" ||
        cadenaOper[0] === "+") &&
      validarCadena(cadenaOper)
    ) {
      try {
        res = eval(cadenaOper);
        historial.push(`${cadenaOper} = ${res}`);
        actualizarHistorial();
        cadenaOper = res.toString();
        screen.value = res;
      } catch {
        screen.value = "Error de Sintaxis";
        cadenaOper = "";
      }
    } else {
      screen.value = "Error de Sintaxis";
      cadenaOper = "";
    }
    return;
  }

  if (valor === "Backspace" || valor === "C") {
    cadenaOper = cadenaOper.slice(0, -1);
    screen.value = cadenaOper;
    return;
  }

  if (valor === "Escape" || valor === "AC") {
    cadenaOper = "";
    res = 0;
    screen.value = "";
    historial = [];
    actualizarHistorial();
    localStorage.removeItem("historialCalc");
    return;
  }
}

const btnBorrarHistorial = document.getElementById("borrarHistorial");
if (btnBorrarHistorial) {
  btnBorrarHistorial.addEventListener("click", () => {
    historial = [];
    actualizarHistorial();
    localStorage.removeItem("historialCalc");
  });
}

buttons.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    identificarTecla(e.target.innerText);
  });
});

document.addEventListener("keydown", (e) => {
  identificarTecla(e.key);
});
