// Funcionalidad del carrusel y otros elementos
document.addEventListener("DOMContentLoaded", function () {
  // Variables del carrusel
  const carouselTrack = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const indicators = document.querySelectorAll(".indicator");
  let currentSlide = 0;
  let slideInterval;

  // Función para mover el carrusel a un slide específico
  function goToSlide(slideIndex) {
    if (slideIndex < 0) slideIndex = slides.length - 1;
    if (slideIndex >= slides.length) slideIndex = 0;

    currentSlide = slideIndex;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Actualizar indicadores
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  // Función para avanzar al siguiente slide
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  // Iniciar carrusel automático
  function startCarousel() {
    slideInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
  }

  // Detener carrusel automático
  function stopCarousel() {
    clearInterval(slideInterval);
  }

  // Event listeners para los indicadores
  indicators.forEach((indicator) => {
    indicator.addEventListener("click", function () {
      const slideIndex = parseInt(this.getAttribute("data-slide"));
      goToSlide(slideIndex);
      stopCarousel();
      startCarousel();
    });
  });

  // Iniciar carrusel
  startCarousel();

  // Pausar carrusel al interactuar
  carouselTrack.addEventListener("mouseenter", stopCarousel);
  carouselTrack.addEventListener("mouseleave", startCarousel);

  // Funcionalidad para los botones "Leer Ahora"
  const readButtons = document.querySelectorAll(
    ".read-button, .comic-button, .featured-button"
  );

  readButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // En una implementación real, esto redirigiría al capítulo/comic
      alert(
        "En una implementación real, esto te llevaría al capítulo/comic seleccionado."
      );
    });
  });

  // Navegación suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
});
