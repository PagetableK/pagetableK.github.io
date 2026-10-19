const btnDesplegar = document.getElementById("agregarNuevoProducto");
const form = document.querySelector("form");
const inputNombre = document.getElementById("nombreProducto");
const inputPrecio = document.getElementById("precioProducto");
const inputCantidad = document.getElementById("cantidadProducto");
const tbody = document.getElementById("tableBody");
const totalUnidades = document.getElementById("totalUnidades");
const montoTotal = document.getElementById("montoTotal");
const btnFiltrar = document.getElementById("btnFiltrar");
const txtFiltro = document.getElementById("precioMax");
const btnMostrarTodo = document.getElementById("btnMostrarTodo");
const btnLimpiarTabla = document.getElementById("btnLimpiarTabla");
let productos = [];

btnDesplegar.addEventListener("click", () => {
  form.classList.toggle("d-none");
  btnDesplegar.classList.toggle("d-none");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (inputNombre.value == "")
    alert("Asegúrate de agregar el nombre del producto.");
  else if (isNaN(inputPrecio.value) || inputPrecio.value < 0)
    alert("El precio no puede ser menor que 0 ni un valor no numérico");
  else if (isNaN(inputCantidad.value) || inputCantidad.value < 0)
    alert("La cantidad no puede ser menor que 0 ni un valor no numérico");
  else if (inputCantidad.value % 1 !== 0)
    alert("La cantidad no puede tener decimales");
  else {
    productos.push({
      nombre: inputNombre.value,
      precio: inputPrecio.value,
      cantidad: inputCantidad.value,
    });

    cargarProductos();

    form.classList.toggle("d-none");
    btnDesplegar.classList.toggle("d-none");
    inputNombre.value = "";
    inputCantidad.value = "";
    inputPrecio.value = "";
  }
});

function cargarProductos(filtro = {}) {
  if (productos.length === 0 && Object.keys(filtro).length === 0) {
    tbody.innerHTML = "";
    totalUnidades.textContent = "0";
    montoTotal.textContent = "$0";
  } else if (Object.keys(filtro).length === 0) {
    let total = 0;
    let unidades = 0;
    tbody.innerHTML = "";
    productos.forEach((element) => {
      tbody.innerHTML += `
        <tr>
            <td>${element.nombre}</td>
            <td>$${element.precio}</td>
            <td>${element.cantidad}</td>
            <td>$${element.cantidad * element.precio}</td>
        </tr>`;
      total += element.cantidad * element.precio;
      unidades += parseInt(element.cantidad);
    });

    totalUnidades.textContent = unidades;
    montoTotal.textContent = `$${total}`;
  } else {
    let total = 0;
    let unidades = 0;
    tbody.innerHTML = "";
    filtro.forEach((element) => {
      tbody.innerHTML += `
        <tr>
            <td>${element.nombre}</td>
            <td>$${element.precio}</td>
            <td>${element.cantidad}</td>
            <td>$${element.cantidad * element.precio}</td>
        </tr>`;
      total += element.cantidad * element.precio;
      unidades += parseInt(element.cantidad);
    });
    totalUnidades.textContent = unidades;
    montoTotal.textContent = `$${total}`;
  }
}

btnFiltrar.addEventListener("click", (event) => {
  if (isNaN(txtFiltro.value) || txtFiltro.value < 0) {
    alert("El precio máximo debe ser un número mayor que 0 (mínimo 0.1)");
  } else if (txtFiltro.value === "") {
  } else {
    productosFiltrados = productos.filter(
      (producto) => producto.precio <= parseFloat(txtFiltro.value),
    );

    if (productosFiltrados == 0) {
      alert(
        "No se encontraron productos con un precio menor o igual a $" +
          txtFiltro.value,
      );
    } else {
      cargarProductos(productosFiltrados);
    }
  }
});

btnMostrarTodo.addEventListener("click", (event) => {
  cargarProductos();
});

btnLimpiarTabla.addEventListener("click", (event) => {
  productos.splice(0, productos.length);
  cargarProductos();
});
