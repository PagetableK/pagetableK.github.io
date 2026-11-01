//Accediendo a los elementos html
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

//Componente modal
const idModal = document.getElementById("idModal");

//Arreglo global de pacientes
let arrayPaciente = [];

/*
Creando una funcion para que limpie el formulario
siempre que se cargue la pagina o cuando se presione
el boton limpiar del formulario
*/

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";

  inputNombre.focus();
};

const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    //Agregando informacion al arreglo paciente
    arrayPaciente.push(
      new Array(nombre, apellido, fechaNacimiento, sexo, labelPais, direccion)
    );

    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Se ha registrado un nuevo paciente";
    //Llamando al componente de Bootstrap
    toast.show();

    //Limpiando formulario
    limpiarForm();
  } else {
    //Asignando un mensaje a nuestra notificacion
    mensaje.innerHTML = "Faltan campos por completar";
    //Llamando al componente de Bootstrap
    toast.show();
  }
};

//Funcion que imprime la ficha de los pacientes registrados
function imprimirFilas() {
    let $fila = "";
    let contador = 1;

    arrayPaciente.forEach((element) => {
        $fila += `<tr>
            <td scope="row" class="text-center fw-bold">${contador}</td>
            <td>${element[0]}</td>
            <td>${element[1]}</td>
            <td>${element[2]}</td>
            <td>${element[3]}</td>
            <td>${element[4]}</td>
            <td>${element[5]}</td>
            <td>
                <button id="idBtnEditar${contador}" type="button" class="btn btn-primary" alt="Eliminar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger" alt="Editar">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </td>
        </tr>`;
        contador++;
    });
    return $fila;
}

const imprimirPacientes = () => {
    let $table = `<div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
            <tr>
                <th scope="col" class="text-center" style="width:5%">#</th>
                <th scope="col" class="text-center" style="width:15%">Nombre</th>
                <th scope="col" class="text-center" style="width:15%">Apellido</th>
                <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                <th scope="col" class="text-center" style="width:10%">Sexo</th>
                <th scope="col" class="text-center" style="width:10%">Pais</th>
                <th scope="col" class="text-center" style="width:25%">Dirección</th>
                <th scope="col" class="text-center" style="width:10%">Opciones</th>
            </tr>
            ${imprimirFilas()}
        </table>
    </div>
    `;
    document.getElementById("idTablaPacientes").innerHTML = $table;
};

// Contador global de los option correspondiente
// al select (cmb) pais
let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
    let paisNew = inputNombrePais.value;

    if (paisNew != "") {
        // Creando nuevo option con la API DOM
        let option = document.createElement("option");
        option.textContent = paisNew;
        option.value = contadorGlobalOption + 1;

        //Agregando el nuevo option en el select
        cmbPais.appendChild(option);

        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Pais agregado correctamente";
        //Llamando al componente de Bootstrap
        toast.show();
    } else {
        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Faltan campos por completar";
        //Llamando al componente de Bootstrap
        toast.show();
    }
};

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonLimpiarPaciente.onclick = () => {
    limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
    addPaciente();
};

buttonMostrarPaciente.onclick = () => {
    imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
    addPais();
};

// Se agrega el focus en el campo nombre pais del modal
idModal.addEventListener("shown.bs.modal", () => {
    inputNombrePais.value = "";
    inputNombrePais.focus();
});

//Ejecutar funcion al momento de cargar la pagina HTML
limpiarForm();


//====================EJERCICIOS======================


let indiceEdicion = null;



const cargarDeLocalStorage = () => {
  const datosGuardados = localStorage.getItem("pacientes");
  if (datosGuardados) {
    arrayPaciente = JSON.parse(datosGuardados);
    imprimirPacientes();
  }
};

const guardarEnLocalStorage = () => {
  localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
};

const eliminarPaciente = (index) => {
  if (confirm("Está seguro de eliminar este registro?")) {
    arrayPaciente.splice(index, 1);
    guardarEnLocalStorage();
    imprimirPacientes();

    mensaje.innerHTML = "Paciente eliminado correctamente";
    toast.show();
  }
};

const editarPaciente = (index) => {
  const paciente = arrayPaciente[index];

  inputNombre.value = paciente[0];
  inputApellido.value = paciente[1];
  inputFechaNacimiento.value = paciente[2];

  if (paciente[3] === "Hombre") {
    inputRdMasculino.checked = true;
  } else if (paciente[3] === "Mujer") {
    inputRdFemenino.checked = true;
  }

  for (let i = 0; i < cmbPais.options.length; i++) {
    if (cmbPais.options[i].text === paciente[4]) {
      cmbPais.selectedIndex = i;
      break;
    }
  }

  inputDireccion.value = paciente[5];
  indiceEdicion = index;

  buttonAgregarPaciente.innerHTML = '<i class="bi bi-arrow-repeat"></i> Actualizar Datos';
  inputNombre.focus();
};

const contenedorTabla = document.getElementById("idTablaPacientes");
if (contenedorTabla) {
  contenedorTabla.addEventListener("click", (e) => {
    const btnEditar = e.target.closest("button[id^='idBtnEditar']");
    const btnEliminar = e.target.closest("button[id^='idBtnEliminar']");

    if (btnEditar) {
      const fila = btnEditar.closest("tr");
      const index = parseInt(fila.querySelector("td").textContent) - 1;
      editarPaciente(index);
    }

    if (btnEliminar) {
      const fila = btnEliminar.closest("tr");
      const index = parseInt(fila.querySelector("td").textContent) - 1;
      eliminarPaciente(index);
    }
  });
}

buttonAgregarPaciente.onclick = () => {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo = inputRdMasculino.checked ? "Hombre" : inputRdFemenino.checked ? "Mujer" : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (nombre != "" && apellido != "" && fechaNacimiento != "" && sexo != "" && pais != 0 && direccion != "") {
    const datosPaciente = [nombre, apellido, fechaNacimiento, sexo, labelPais, direccion];

    if (indiceEdicion !== null) {
      arrayPaciente[indiceEdicion] = datosPaciente;
      indiceEdicion = null;
      buttonAgregarPaciente.innerHTML = '<i class="bi bi-person-plus-fill"></i> Guardar Datos';
      mensaje.innerHTML = "Registro actualizado correctamente";
    } else {
      addPaciente();
    }

    guardarEnLocalStorage();
    toast.show();
    limpiarForm();
    imprimirPacientes();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

const fnLimpiarOriginal = limpiarForm;
buttonLimpiarPaciente.onclick = () => {
  fnLimpiarOriginal();
  indiceEdicion = null;
  buttonAgregarPaciente.innerHTML = '<i class="bi bi-person-plus-fill"></i> Guardar Datos';
};

cargarDeLocalStorage();


//===================REGEX=======================


const regexEstudiante = {
  // Dos letras seguidas de tres números 
  carnet: /^[A-Za-z]{2}\d{3}$/,

  // solo letras y espacios con tildes y eñes
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,

  // 8 dígitos, guion y 1 dígito verificador ########-#
  dui: /^\d{8}-\d{1}$/,

  // 4 dígitos - 6 dígitos - 3 dígitos - 1 dígito ####-######-###-#
  nit: /^\d{4}-\d{6}-\d{3}-\d{1}$/,

  // DD/MM/AAAA o DD-MM-AAAA
  fechaNacimiento: /^(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)\d\d$/,

  // Correo electrónico estándar
  correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // solo números enteros positivos de 1 a 3 dígitos
  edad: /^\d{1,3}$/
};