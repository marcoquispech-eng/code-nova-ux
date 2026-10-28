const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const registrar = document.getElementById("registrar");
const clave = document.getElementById("clave");
const mostrarClave = document.getElementById("mostrar-clave");
const campos = formulario.querySelectorAll("input");

let temporizador = null;

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
}

function validarCampo(campo) {
  campo.setCustomValidity("");

  if (!campo.value.trim()) {
    campo.setCustomValidity("Completa este campo.");
  } else if (campo === clave && campo.value.trim().length < 8) {
    campo.setCustomValidity(
      "Usa al menos 8 caracteres, sin contar espacios al inicio o al final.",
    );
  }
}

function restaurarBoton() {
  registrar.disabled = false;
  registrar.textContent = "Crear cuenta de prueba";
  formulario.removeAttribute("aria-busy");
}

campos.forEach(function (campo) {
  campo.addEventListener("input", function () {
    validarCampo(campo);
    campo.removeAttribute("aria-invalid");
  });
});

mostrarClave.addEventListener("click", function () {
  const mostrar = clave.type === "password";

  clave.type = mostrar ? "text" : "password";
  mostrarClave.textContent = mostrar
    ? "Ocultar contraseña"
    : "Mostrar contraseña";
  mostrarClave.setAttribute("aria-pressed", String(mostrar));

  mostrarMensaje(
    mostrar ? "Contraseña visible." : "Contraseña oculta.",
    "info",
  );
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (temporizador !== null) {
    return;
  }

  formulario.classList.add("validado");

  campos.forEach(function (campo) {
    validarCampo(campo);
    campo.setAttribute("aria-invalid", String(!campo.validity.valid));
  });

  if (!formulario.checkValidity()) {
    const primeroInvalido = formulario.querySelector("input:invalid");
    const etiqueta = formulario.querySelector(
      'label[for="' + primeroInvalido.id + '"]',
    );

    mostrarMensaje(
      "Revisa " +
        etiqueta.textContent +
        ": " +
        primeroInvalido.validationMessage,
      "error",
    );

    primeroInvalido.focus();
    return;
  }

  registrar.disabled = true;
  registrar.textContent = "Procesando...";
  formulario.setAttribute("aria-busy", "true");
  mostrarMensaje("Procesando el registro de prueba...", "info");

  temporizador = setTimeout(function () {
    temporizador = null;
    restaurarBoton();

    mostrarMensaje(
      "¡Registro de prueba completado! No se creó una cuenta real ni se guardaron tus datos.",
      "exito",
    );
  }, 1500);
});

formulario.addEventListener("reset", function (evento) {
  const confirmar = confirm(
    "¿Quieres borrar todos los datos? Esta acción no se puede deshacer.",
  );

  if (!confirmar) {
    evento.preventDefault();
    mostrarMensaje("Limpieza cancelada. Tus datos se conservan.", "info");
    return;
  }

  clearTimeout(temporizador);
  temporizador = null;
  restaurarBoton();

  formulario.classList.remove("validado");

  campos.forEach(function (campo) {
    campo.setCustomValidity("");
    campo.removeAttribute("aria-invalid");
  });

  clave.type = "password";
  mostrarClave.textContent = "Mostrar contraseña";
  mostrarClave.setAttribute("aria-pressed", "false");

  mostrarMensaje("Formulario limpio. Puedes empezar de nuevo.", "info");
});
