// SWITCH SIMPLIFICADO QUE SÍ FUNCIONA
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎮 Switch inicializando...");

  const deviceSwitch = document.getElementById("deviceSwitch");
  const body = document.body;

  if (!deviceSwitch) {
    console.error("❌ Switch no encontrado");
    return;
  }

  // Función para actualizar todo
  function updateMode() {
    const isPCMode = deviceSwitch.checked;
    console.log(isPCMode ? "💻 Modo PC" : "📱 Modo Smartphone");

    // Cambiar clases del body
    if (isPCMode) {
      body.classList.add("pc-mode");
      body.classList.remove("smartphone-mode");
    } else {
      body.classList.add("smartphone-mode");
      body.classList.remove("pc-mode");
    }

    // Guardar preferencia
    localStorage.setItem("layoutMode", isPCMode ? "pc" : "smartphone");
  }

  // Evento al cambiar
  deviceSwitch.addEventListener("change", updateMode);

  // Cargar preferencia guardada
  const savedMode = localStorage.getItem("layoutMode");
  if (savedMode === "pc") {
    deviceSwitch.checked = true;
  } else if (savedMode === "smartphone") {
    deviceSwitch.checked = false;
  } else {
    // Auto-detectar por tamaño de pantalla
    deviceSwitch.checked = window.innerWidth > 768;
  }

  // Actualizar al inicio
  updateMode();

  console.log("✅ Switch listo - ¡Haz clic para probar!");
});
// Sistema de modal de confirmación para el switch
document.addEventListener("DOMContentLoaded", function () {
  // Crear el modal de confirmación si no existe
  if (!document.querySelector(".confirmation-modal")) {
    const modalHTML = `
        <div class="confirmation-modal" id="orientationModal">
          <div class="modal-content">
            <h2 class="modal-title" id="modalTitle">Confirmar Cambio de Orientación</h2>
            <p class="modal-message" id="modalMessage">¿Estás seguro de que quieres cambiar la orientación de lectura?</p>
            <div class="modal-buttons">
              <button class="modal-button modal-confirm" id="confirmButton">Sí, Cambiar</button>
              <button class="modal-button modal-cancel" id="cancelButton">Cancelar</button>
            </div>
          </div>
        </div>
      `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // Variables globales
  const switchElement = document.getElementById("deviceSwitch");
  const modal = document.getElementById("orientationModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");
  const modeText = document.getElementById("modeText");

  let pendingOrientation = null;
  let isMobile = switchElement.checked;

  // Configurar el texto inicial
  updateModeText();

  // Función para actualizar el texto del modo
  function updateModeText() {
    if (switchElement.checked) {
      modeText.textContent = "Modo Horizontal (PC)";
    } else {
      modeText.textContent = "Modo Vertical (Móvil)";
    }
  }

  // Función para mostrar el modal
  function showModal(isToMobile) {
    if (isToMobile) {
      modalTitle.textContent = "Activar Modo Vertical";
      modalMessage.textContent =
        "¿Estás seguro de activar el modo de lectura vertical? (Recomendado para móvil)";
      pendingOrientation = "vertical";
    } else {
      modalTitle.textContent = "Activar Modo Horizontal";
      modalMessage.textContent =
        "¿Estás seguro de activar el modo de lectura horizontal? (Recomendado para PC)";
      pendingOrientation = "horizontal";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Evitar scroll mientras el modal está abierto
  }

  // Función para ocultar el modal
  function hideModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restaurar scroll
    pendingOrientation = null;
  }

  // Función para cambiar la orientación
  function changeOrientation(orientation) {
    if (orientation === "vertical") {
      // Modo vertical (móvil)
      switchElement.checked = false;
      applyVerticalMode();
    } else {
      // Modo horizontal (PC)
      switchElement.checked = true;
      applyHorizontalMode();
    }

    updateModeText();
    updateIcons();
    saveOrientationPreference();
  }

  // Función para aplicar modo vertical
  function applyVerticalMode() {
    document.body.classList.remove("horizontal-mode");
    document.body.classList.add("vertical-mode");

    // Actualizar indicadores visuales
    const indicators = document.querySelectorAll(".indicator");
    indicators.forEach((ind) => ind.classList.remove("active"));
    if (indicators[0]) indicators[0].classList.add("active");
  }

  // Función para aplicar modo horizontal
  function applyHorizontalMode() {
    document.body.classList.remove("vertical-mode");
    document.body.classList.add("horizontal-mode");

    // Actualizar indicadores visuales
    const indicators = document.querySelectorAll(".indicator");
    indicators.forEach((ind) => ind.classList.remove("active"));
    if (indicators[1]) indicators[1].classList.add("active");
  }

  // Función para actualizar iconos
  function updateIcons() {
    const mobileIcon = document.querySelector(".mobile-icon");
    const pcIcon = document.querySelector(".pc-icon");

    if (switchElement.checked) {
      mobileIcon.classList.remove("active");
      pcIcon.classList.add("active");
    } else {
      mobileIcon.classList.add("active");
      pcIcon.classList.remove("active");
    }
  }

  // Función para guardar la preferencia
  function saveOrientationPreference() {
    localStorage.setItem(
      "histocomic-orientation",
      switchElement.checked ? "horizontal" : "vertical"
    );
  }

  // Función para cargar la preferencia guardada
  function loadOrientationPreference() {
    const savedOrientation = localStorage.getItem("histocomic-orientation");

    if (savedOrientation === "horizontal") {
      switchElement.checked = true;
      changeOrientation("horizontal");
    } else if (savedOrientation === "vertical") {
      switchElement.checked = false;
      changeOrientation("vertical");
    } else {
      // Por defecto, detectar dispositivo
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (isMobileDevice) {
        switchElement.checked = false;
        changeOrientation("vertical");
      } else {
        switchElement.checked = true;
        changeOrientation("horizontal");
      }
    }
  }

  // Evento para el cambio del switch
  switchElement.addEventListener("change", function () {
    const isToMobile = !this.checked; // Si se desmarca, es para ir a móvil

    // Mostrar modal de confirmación
    showModal(isToMobile);

    // Revertir el cambio hasta que se confirme
    this.checked = !this.checked;
  });

  // Evento para confirmar el cambio
  confirmButton.addEventListener("click", function () {
    if (pendingOrientation) {
      changeOrientation(pendingOrientation);
    }
    hideModal();
  });

  // Evento para cancelar el cambio
  cancelButton.addEventListener("click", function () {
    hideModal();
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      hideModal();
    }
  });

  // Cargar preferencia al iniciar
  loadOrientationPreference();
});
