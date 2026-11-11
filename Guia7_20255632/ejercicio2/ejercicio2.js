const RAPIDAPI_KEY = "bb95e5366emsh1f27d44d2fd8d5ep17f445jsn55a76012fdfd";
const RAPIDAPI_HOST = "exercisedb.p.rapidapi.com";
const BASE_URL = `https://${RAPIDAPI_HOST}`;

const headers = {
  "x-rapidapi-key": RAPIDAPI_KEY,
  "x-rapidapi-host": RAPIDAPI_HOST
};

const exercisesContainer = document.getElementById("exercisesContainer");
const detailContainer = document.getElementById("detailContainer");
const statusContainer = document.getElementById("statusContainer");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("errorMessage");
const badgeCount = document.getElementById("badgeCount");

const setLoading = (isLoading, errorText = null) => {
  if (isLoading) {
    statusContainer.classList.remove("d-none");
    spinner.classList.remove("d-none");
    errorMessage.classList.add("d-none");
  } else {
    spinner.classList.add("d-none");
    if (errorText) {
      statusContainer.classList.remove("d-none");
      errorMessage.textContent = errorText;
      errorMessage.classList.remove("d-none");
    } else {
      statusContainer.classList.add("d-none");
    }
  }
};

const cargarListadoEjercicios = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${BASE_URL}/exercises?limit=10&offset=0`, {
      method: "GET",
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    badgeCount.textContent = `${data.length} ejercicios`;
    renderListado(data);
    setLoading(false);
  } catch (error) {
    setLoading(false, `Error al consultar ejercicios en RapidAPI: ${error.message}`);
  }
};

const renderListado = (exercises) => {
  exercisesContainer.replaceChildren();

  exercises.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-md-6";

    const card = document.createElement("div");
    card.className = "card h-100 exercise-card shadow-sm";
    card.id = `exercise-${item.id}`;

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";

    const title = document.createElement("h6");
    title.className = "card-title text-capitalize fw-bold text-dark";
    title.textContent = item.name;

    const badgesDiv = document.createElement("div");
    badgesDiv.className = "d-flex gap-2 flex-wrap mb-2";

    const partBadge = document.createElement("span");
    partBadge.className = "badge badge-bodypart text-capitalize border";
    partBadge.textContent = item.bodyPart;

    const targetBadge = document.createElement("span");
    targetBadge.className = "badge bg-secondary text-capitalize";
    targetBadge.textContent = `Target: ${item.target}`;

    badgesDiv.appendChild(partBadge);
    badgesDiv.appendChild(targetBadge);

    const desc = document.createElement("p");
    desc.className = "card-text small text-muted flex-grow-1";
    desc.textContent = item.description;

    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary btn-sm w-100 mt-2";
    btn.textContent = "Ver técnica y detalle";

    card.addEventListener("click", () => {
      document.querySelectorAll(".exercise-card").forEach((c) => c.classList.remove("active-card"));
      card.classList.add("active-card");
      cargarDetalleEjercicio(item.id, item);
    });

    body.appendChild(title);
    body.appendChild(badgesDiv);
    body.appendChild(desc);
    body.appendChild(btn);

    card.appendChild(body);
    col.appendChild(card);
    exercisesContainer.appendChild(col);
  });
};

const cargarDetalleEjercicio = async (id, itemFallback) => {
  detailContainer.replaceChildren();

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "text-center my-4";
  loadingDiv.innerHTML = `
    <div class="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
    <p class="text-muted small">Cargando...</p>
  `;
  detailContainer.appendChild(loadingDiv);

  try {
    const response = await fetch(`${BASE_URL}/exercises/exercise/${id}`, {
      method: "GET",
      headers: headers
    });

    if (!response.ok) {
      renderDetalle(itemFallback);
      return;
    }

    const detailData = await response.json();
    renderDetalle(detailData);
  } catch (error) {
    renderDetalle(itemFallback);
  }
};

const renderDetalle = (item) => {
  detailContainer.replaceChildren();

  const title = document.createElement("h3");
  title.className = "h5 fw-bold text-capitalize mb-2 text-primary";
  title.textContent = item.name;

  const desc = document.createElement("p");
  desc.className = "small text-secondary mb-3";
  desc.textContent = item.description;

  const listGroup = document.createElement("ul");
  listGroup.className = "list-group list-group-flush small mb-3";

  const specs = [
    { label: "Parte del cuerpo", value: item.bodyPart },
    { label: "Músculo principal", value: item.target },
    { label: "Músculos secundarios", value: (item.secondaryMuscles || []).join(", ") || "Ninguno" },
    { label: "Equipamiento", value: item.equipment },
    { label: "Dificultad", value: item.difficulty || "No especificada" },
    { label: "Categoría", value: item.category || "strength" }
  ];

  specs.forEach((s) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between px-0 text-capitalize";

    const strong = document.createElement("strong");
    strong.textContent = s.label;

    const span = document.createElement("span");
    span.className = "text-muted";
    span.textContent = s.value;

    li.appendChild(strong);
    li.appendChild(span);
    listGroup.appendChild(li);
  });

  const instTitle = document.createElement("h6");
  instTitle.className = "fw-bold small border-top pt-3 mt-2";
  instTitle.textContent = "Instrucciones paso a paso:";

  const ol = document.createElement("ol");
  ol.className = "small text-secondary ps-3 mb-0";

  if (Array.isArray(item.instructions)) {
    item.instructions.forEach((step) => {
      const li = document.createElement("li");
      li.className = "mb-1";
      li.textContent = step;
      ol.appendChild(li);
    });
  }

  detailContainer.appendChild(title);
  detailContainer.appendChild(desc);
  detailContainer.appendChild(listGroup);
  detailContainer.appendChild(instTitle);
  detailContainer.appendChild(ol);
};

document.addEventListener("DOMContentLoaded", () => {
  cargarListadoEjercicios();
});