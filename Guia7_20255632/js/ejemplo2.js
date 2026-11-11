const REGEX_CORREO = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const formulario = document.forms["frmRegistro"];
const botonRegistro = formulario.elements["btnRegistro"];

const modalElemento = document.getElementById("idModal");
const modal = new bootstrap.Modal(modalElemento, {});
const bodyModal = document.getElementById("idBodyModal");
const modalTitulo = document.getElementById("modalLabel");

const campos = {
    nombre: document.getElementById("idNombre"),
    apellidos: document.getElementById("idApellidos"),
    fechaNac: document.getElementById("idFechaNac"),
    correo: document.getElementById("idCorreo"),
    password: document.getElementById("idPassword"),
    passwordRepetir: document.getElementById("idPasswordRepetir"),
    intereses: Array.from(
        formulario.querySelectorAll(
            "#idCkProgramacion, #idCkBD, #idCkRedes, #idCkSeguridad"
        )
    ),
    carreras: Array.from(
        formulario.querySelectorAll('input[name="idRdCarrera"]')
    ),
    pais: document.getElementById("idCmPais"),
    archivo: document.getElementById("idArchivo"),
};

/**
 * Elimina todos los nodos hijos de un elemento del DOM sin usar innerHTML.
 * @param {HTMLElement} elemento
 */
const limpiarElementoDOM = (elemento) => {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
};

/**
 * Obtiene el texto visible de la etiqueta <label> asociada a un control.
 * @param {HTMLElement} control
 * @returns {string}
 */
const obtenerTextoLabel = (control) => {
    if (!control || !control.id) {
        return "";
    }
    const etiqueta = formulario.querySelector(`label[for="${control.id}"]`);
    return etiqueta ? etiqueta.textContent.trim() : "";
};

/**
 * Obtiene o crea el contenedor de alerta de validación encima del formulario.
 * @returns {HTMLDivElement}
 */
const obtenerOCrearAlerta = () => {
    let alerta = document.getElementById("idAlertaValidacion");
    if (!alerta) {
        alerta = document.createElement("div");
        alerta.setAttribute("id", "idAlertaValidacion");
        alerta.setAttribute("class", "alert alert-danger d-none");
        alerta.setAttribute("role", "alert");
        formulario.parentNode.insertBefore(alerta, formulario);
    }
    return alerta;
};

/**
 * Oculta y limpia la alerta general de validación.
 */
const ocultarAlerta = () => {
    const alerta = document.getElementById("idAlertaValidacion");
    if (alerta) {
        limpiarElementoDOM(alerta);
        alerta.classList.add("d-none");
    }
};

/**
 * Elimina las marcas y mensajes de error previos en un contenedor específico.
 * @param {HTMLElement|null} contenedor
 */
const eliminarMensajesContenedor = (contenedor) => {
    if (!contenedor) {
        return;
    }
    const mensajes = contenedor.querySelectorAll('[data-feedback-error="true"]');
    mensajes.forEach((mensaje) => mensaje.remove());
};

/**
 * Limpia el estado de error de un campo individual o de un grupo de controles.
 * @param {HTMLElement} control
 * @param {HTMLElement[]} [grupo]
 */
const limpiarEstadoCampo = (control, grupo = null) => {
    if (Array.isArray(grupo) && grupo.length > 0) {
        grupo.forEach((item) => item.classList.remove("is-invalid"));
        eliminarMensajesContenedor(grupo[0].closest(".col"));
    } else if (control) {
        control.classList.remove("is-invalid");
        eliminarMensajesContenedor(control.parentElement);
    }

    if (formulario.querySelectorAll(".is-invalid").length === 0) {
        ocultarAlerta();
    }
};

/**
 * Limpia todos los mensajes de error y clases de validación del formulario.
 */
const limpiarErrores = () => {
    const controlesInvalidos = formulario.querySelectorAll(".is-invalid");
    controlesInvalidos.forEach((control) => control.classList.remove("is-invalid"));

    const mensajes = formulario.querySelectorAll('[data-feedback-error="true"]');
    mensajes.forEach((mensaje) => mensaje.remove());

    ocultarAlerta();
};

/**
 * Aplica el estilo de error de Bootstrap y agrega el mensaje descriptivo en DOM.
 * @param {{ elemento: HTMLElement, mensaje: string, grupo?: HTMLElement[], contenedorFeedback?: HTMLElement }} error
 */
const aplicarFeedbackError = (error) => {
    const feedback = document.createElement("div");
    feedback.setAttribute("data-feedback-error", "true");
    feedback.appendChild(document.createTextNode(error.mensaje));

    if (Array.isArray(error.grupo) && error.grupo.length > 0) {
        error.grupo.forEach((item) => item.classList.add("is-invalid"));
        feedback.className = "invalid-feedback d-block mb-3";
        const contenedor = error.contenedorFeedback || error.grupo[0].closest(".col");
        if (contenedor) {
            contenedor.appendChild(feedback);
        }
        return;
    }

    error.elemento.classList.add("is-invalid");
    feedback.className = "invalid-feedback";
    if (error.elemento.parentElement) {
        error.elemento.parentElement.appendChild(feedback);
    }
};

/**
 * Muestra la alerta general con los errores detectados sin usar innerHTML.
 * @param {Array<{ elemento: HTMLElement, mensaje: string }>} errores
 */
const mostrarAlertaErrores = (errores) => {
    const alerta = obtenerOCrearAlerta();
    limpiarElementoDOM(alerta);

    const titulo = document.createElement("strong");
    titulo.setAttribute("class", "d-block mb-1");
    titulo.appendChild(
        document.createTextNode(
            errores.length === 1
                ? "Error de validación:"
                : "Por favor corrija los siguientes errores:"
        )
    );
    alerta.appendChild(titulo);

    if (errores.length === 1) {
        const textoError = document.createElement("p");
        textoError.setAttribute("class", "mb-0");
        textoError.appendChild(document.createTextNode(errores[0].mensaje));
        alerta.appendChild(textoError);
    } else {
        const lista = document.createElement("ul");
        lista.setAttribute("class", "mb-0 ps-3");
        errores.forEach((error) => {
            const item = document.createElement("li");
            item.appendChild(document.createTextNode(error.mensaje));
            lista.appendChild(item);
        });
        alerta.appendChild(lista);
    }

    alerta.classList.remove("d-none");
};

const validarCampoObligatorio = (input, nombreCampo) => {
    if (input.value.trim() === "") {
        return {
            valido: false,
            elemento: input,
            mensaje: `El campo "${nombreCampo}" no puede quedar vacío.`,
        };
    }
    return { valido: true };
};

const validarFechaNacimiento = (inputFecha) => {
    const valor = inputFecha.value.trim();
    if (valor === "") {
        return {
            valido: false,
            elemento: inputFecha,
            mensaje: "Debe ingresar su fecha de nacimiento.",
        };
    }

    const partes = valor.split("-");
    if (partes.length !== 3) {
        return {
            valido: false,
            elemento: inputFecha,
            mensaje: "La fecha de nacimiento no tiene un formato válido.",
        };
    }

    const anio = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);
    const fechaNac = new Date(anio, mes - 1, dia);

    if (
        Number.isNaN(fechaNac.getTime()) ||
        fechaNac.getFullYear() !== anio ||
        fechaNac.getMonth() !== mes - 1 ||
        fechaNac.getDate() !== dia
    ) {
        return {
            valido: false,
            elemento: inputFecha,
            mensaje: "La fecha de nacimiento ingresada no es válida.",
        };
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaNac > hoy) {
        return {
            valido: false,
            elemento: inputFecha,
            mensaje: "La fecha de nacimiento no puede ser posterior a la fecha actual.",
        };
    }

    return { valido: true };
};

const validarCorreo = (inputCorreo) => {
    const valor = inputCorreo.value.trim();
    if (valor === "") {
        return {
            valido: false,
            elemento: inputCorreo,
            mensaje: "Debe ingresar su correo electrónico.",
        };
    }

    if (!REGEX_CORREO.test(valor)) {
        return {
            valido: false,
            elemento: inputCorreo,
            mensaje: "El correo electrónico no tiene un formato válido (ejemplo: usuario@dominio.com).",
        };
    }

    return { valido: true };
};

const validarPasswords = (inputPassword, inputRepetir) => {
    const errores = [];
    const passVacia = inputPassword.value.trim() === "";
    const repetirVacia = inputRepetir.value.trim() === "";

    if (passVacia) {
        errores.push({
            valido: false,
            elemento: inputPassword,
            mensaje: "Debe ingresar una contraseña.",
        });
    }

    if (repetirVacia) {
        errores.push({
            valido: false,
            elemento: inputRepetir,
            mensaje: "Debe confirmar su contraseña.",
        });
    }

    if (!passVacia && !repetirVacia && inputPassword.value !== inputRepetir.value) {
        errores.push({
            valido: false,
            elemento: inputRepetir,
            mensaje: "La contraseña y la confirmación de contraseña no coinciden.",
        });
    }

    return errores;
};

const validarIntereses = (checkboxes) => {
    const algunoMarcado = checkboxes.some((cb) => cb.checked);
    if (!algunoMarcado) {
        return {
            valido: false,
            elemento: checkboxes[0],
            grupo: checkboxes,
            contenedorFeedback: checkboxes[0].closest(".col"),
            mensaje: "Debe seleccionar al menos un interés.",
        };
    }
    return { valido: true };
};

const validarCarrera = (radios) => {
    const seleccionado = radios.some((radio) => radio.checked);
    if (!seleccionado) {
        return {
            valido: false,
            elemento: radios[0],
            grupo: radios,
            contenedorFeedback: radios[0].closest(".col"),
            mensaje: "Debe seleccionar una carrera.",
        };
    }
    return { valido: true };
};

const validarPais = (selectPais) => {
    const opcion = selectPais.options[selectPais.selectedIndex];
    const valorAtributo = opcion ? opcion.getAttribute("value") : null;

    if (
        selectPais.selectedIndex <= 0 ||
        valorAtributo === null ||
        valorAtributo.trim() === ""
    ) {
        return {
            valido: false,
            elemento: selectPais,
            mensaje: "Debe seleccionar un país de origen.",
        };
    }

    return { valido: true };
};

const validarArchivo = (inputArchivo) => {
    if (!inputArchivo.files || inputArchivo.files.length === 0) {
        return {
            valido: false,
            elemento: inputArchivo,
            mensaje: "Debe seleccionar una imagen para su avatar.",
        };
    }
    return { valido: true };
};

/**
 * Ejecuta todas las reglas de validación del formulario en orden visual.
 * @returns {Array<{ elemento: HTMLElement, mensaje: string, grupo?: HTMLElement[], contenedorFeedback?: HTMLElement }>}
 */
const validarFormulario = () => {
    const errores = [];

    const validacionesSimples = [
        validarCampoObligatorio(campos.nombre, "Nombres"),
        validarCampoObligatorio(campos.apellidos, "Apellidos"),
        validarFechaNacimiento(campos.fechaNac),
        validarCorreo(campos.correo),
        ...validarPasswords(campos.password, campos.passwordRepetir),
        validarIntereses(campos.intereses),
        validarCarrera(campos.carreras),
        validarPais(campos.pais),
        validarArchivo(campos.archivo),
    ];

    validacionesSimples.forEach((resultado) => {
        if (!resultado.valido) {
            errores.push(resultado);
        }
    });

    return errores;
};

/**
 * Recopila los valores validados del formulario para mostrarlos en el modal.
 * @returns {Array<{ campo: string, valor: string }>}
 */
const obtenerDatosFormulario = () => {
    const interesesSeleccionados = campos.intereses
        .filter((cb) => cb.checked)
        .map((cb) => obtenerTextoLabel(cb));

    const carreraSeleccionada = campos.carreras.find((rd) => rd.checked);
    const opcionPais = campos.pais.options[campos.pais.selectedIndex];
    const archivo = campos.archivo.files[0];

    return [
        { campo: "Nombres", valor: campos.nombre.value.trim() },
        { campo: "Apellidos", valor: campos.apellidos.value.trim() },
        { campo: "Fecha de nacimiento", valor: campos.fechaNac.value },
        { campo: "Correo electrónico", valor: campos.correo.value.trim() },
        {
            campo: "Contraseña",
            valor: `${"•".repeat(campos.password.value.length)} (${campos.password.value.length} caracteres)`,
        },
        { campo: "Intereses", valor: interesesSeleccionados.join(", ") },
        { campo: "Carrera", valor: obtenerTextoLabel(carreraSeleccionada) },
        {
            campo: "País de origen",
            valor: opcionPais ? opcionPais.textContent.trim() : "",
        },
        { campo: "Avatar", valor: archivo ? archivo.name : "" },
    ];
};

/**
 * Crea una celda de tabla (th o td) usando únicamente métodos estándar del DOM.
 * @param {"th"|"td"} etiqueta
 * @param {string} texto
 * @param {Record<string, string>} [atributos]
 * @returns {HTMLTableCellElement}
 */
const crearCeldaTabla = (etiqueta, texto, atributos = {}) => {
    const celda = document.createElement(etiqueta);
    Object.entries(atributos).forEach(([clave, valor]) => {
        celda.setAttribute(clave, valor);
    });
    celda.appendChild(document.createTextNode(texto));
    return celda;
};

/**
 * Construye una tabla Bootstrap con los datos del formulario sin usar innerHTML.
 * @param {Array<{ campo: string, valor: string }>} datos
 * @returns {HTMLDivElement}
 */
const crearTablaResumen = (datos) => {
    const contenedorTabla = document.createElement("div");
    contenedorTabla.setAttribute("class", "table-responsive");

    const tabla = document.createElement("table");
    tabla.setAttribute(
        "class",
        "table table-striped table-bordered table-hover align-middle mb-0"
    );

    const thead = document.createElement("thead");
    thead.setAttribute("class", "table-dark");
    const filaEncabezado = document.createElement("tr");
    filaEncabezado.appendChild(crearCeldaTabla("th", "Campo", { scope: "col" }));
    filaEncabezado.appendChild(crearCeldaTabla("th", "Valor ingresado", { scope: "col" }));
    thead.appendChild(filaEncabezado);

    const tbody = document.createElement("tbody");
    datos.forEach(({ campo, valor }) => {
        const fila = document.createElement("tr");
        fila.appendChild(
            crearCeldaTabla("th", campo, { scope: "row", class: "text-nowrap" })
        );
        fila.appendChild(crearCeldaTabla("td", valor));
        tbody.appendChild(fila);
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    contenedorTabla.appendChild(tabla);

    return contenedorTabla;
};

/**
 * Limpia el modal, construye la tabla DOM con los datos recopilados y abre el modal.
 * @param {Array<{ campo: string, valor: string }>} datos
 */
const mostrarDatosEnModal = (datos) => {
    limpiarElementoDOM(bodyModal);

    if (modalTitulo) {
        limpiarElementoDOM(modalTitulo);
        modalTitulo.appendChild(document.createTextNode("Datos del registro"));
    }

    const modalDialog = modalElemento.querySelector(".modal-dialog");
    if (modalDialog && !modalDialog.classList.contains("modal-lg")) {
        modalDialog.classList.add("modal-lg");
    }

    bodyModal.appendChild(crearTablaResumen(datos));
    modal.show();
};

/**
 * Procesa la validación y envío del formulario.
 */
const procesarFormulario = () => {
    limpiarErrores();

    const errores = validarFormulario();
    if (errores.length > 0) {
        errores.forEach((error) => aplicarFeedbackError(error));
        mostrarAlertaErrores(errores);
        errores[0].elemento.focus();
        return;
    }

    const datos = obtenerDatosFormulario();
    mostrarDatosEnModal(datos);
};

/**
 * Limpia la retroalimentación visual cuando el usuario modifica un campo.
 */
const registrarEventosLimpieza = () => {
    [
        campos.nombre,
        campos.apellidos,
        campos.fechaNac,
        campos.correo,
        campos.password,
        campos.passwordRepetir,
    ].forEach((input) => {
        input.addEventListener("input", () => limpiarEstadoCampo(input));
    });

    campos.intereses.forEach((checkbox) => {
        checkbox.addEventListener("change", () =>
            limpiarEstadoCampo(checkbox, campos.intereses)
        );
    });

    campos.carreras.forEach((radio) => {
        radio.addEventListener("change", () =>
            limpiarEstadoCampo(radio, campos.carreras)
        );
    });

    campos.pais.addEventListener("change", () => limpiarEstadoCampo(campos.pais));
    campos.archivo.addEventListener("change", () => limpiarEstadoCampo(campos.archivo));
};

formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    procesarFormulario();
});

botonRegistro.addEventListener("click", () => {
    if (botonRegistro.type !== "submit") {
        procesarFormulario();
    }
});

registrarEventosLimpieza();
