document.addEventListener("DOMContentLoaded", function () {
  const containerEstudiantes = document.querySelector(
    "#idContainerEstudiantes",
  );

  const btnAddEstudiante = document.querySelector("#idBtnAgregarEstudiante");
  const btnViewEstudiantes = document.querySelector("#idBtnMostrarEstudiantes");

  btnAddEstudiante.addEventListener("click", addEstudiantes);
  btnViewEstudiantes.addEventListener("click", viewEstudiantes);

  let arrayEstudiantes = new Array();

  function addEstudiantes() {
    const inputCarnet = document
      .querySelector("#idInputCarnet")
      .value.toString()
      .toUpperCase();
    const inputNombre = document
      .querySelector("#idInputNombre")
      .value.toString()
      .toUpperCase();
    const inputApellidos = document
      .querySelector("#idInputApellidos")
      .value.toString()
      .toUpperCase();

    if (inputCarnet != "" && inputNombre != "" && inputApellidos != "") {
      arrayEstudiantes.push(
        new Array(inputCarnet, inputNombre, inputApellidos),
      );
      alert("Se registró el nuevo estudiante");

      document.querySelector("#inputCarnet").value = "";
      document.querySelector("#inputNombre").value = "";
      document.querySelector("#inputApellidos").value = "";
      document.querySelector("#inputCarnet").focus();
    } else {
      alert("Debe llenar todos los campos");
    }
  }

  function viewEstudiantes() {
    //Validando que existan estudiantes registrados
    let totalEstudiantes = arrayEstudiantes.length;
    if (totalEstudiantes > 0) {
      let carnet;
      let nombres;
      let apellidos;
      let table = "<table class='table table-light table-striped'>";
      table += "<thead>";
      table += "<tr>";
      table += "<th scope='col' style='width: 5%;'>#</th>";
      table += "<th scope='col' style='width: 15%;'>Carnet</th>";
      table += "<th scope='col'>Nombres</th>";
      table += "<th scope='col'>Apellidos</th>";
      table += "</tr>";
      table += "</thead>";
      table += "<tbody>";

      // Utilizaremos un bucle for para recorrer el arreglo de estudiantes
      for (let i = 0; i < arrayEstudiantes.length; i++) {
        //Accediendo a las posiciones del arreglo
        carnet = arrayEstudiantes[i][0];
        nombres = arrayEstudiantes[i][1];
        apellidos = arrayEstudiantes[i][2];

        table += `<tr>`;
        table += `<td scope='row' style='font-weight: bold;'>${i + 1}</td>`;
        table += `<td>${carnet}</td>`;
        table += `<td>${nombres}</td>`;
        table += `<td>${apellidos}</td>`;
        table += `</tr>`;
      }

      table += "</tbody>";
      table += "</table>";
      containerEstudiantes.innerHTML = table;
    } else {
      alert("No se han registrado estudiantes");
    }
  }
});
