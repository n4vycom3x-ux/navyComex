"use strict";

const CAROUSEL_MS = 14000;
const WHATSAPP_NUMBER = "59173004453";

const slides = [
  {
    kicker: "Marítimo · Asia → Bolivia",
    title: "IMPORTA",
    title2: "SIN FRONTERAS",
    description: "Coordinamos tu carga desde fábrica hasta destino: consolidación, flete marítimo, aduana y entrega final, con un solo equipo acompañándote.",
    image: "assets/import-port.webp",
    short: "Carga marítima",
    metric: "FCL · LCL"
  },
  {
    kicker: "Aéreo · Entrega prioritaria",
    title: "MÁS RÁPIDO",
    title2: "MÁS SIMPLE",
    description: "Para repuestos, muestras o mercancía urgente. Gestionamos recolección, documentación y transporte aéreo con seguimiento en cada escala.",
    image: "assets/import-air.webp",
    short: "Carga aérea",
    metric: "3–10 días"
  },
  {
    kicker: "Terrestre · Última milla",
    title: "HASTA TU",
    title2: "NEGOCIO",
    description: "Recibimos tu carga, coordinamos el despacho y la llevamos hasta tu almacén. Sin llamadas cruzadas, sin costos sorpresa y con trazabilidad real.",
    image: "assets/import-ground.webp",
    short: "Entrega nacional",
    metric: "Puerta a puerta"
  }
];

const hero = document.querySelector(".hero-section");
const stage = document.querySelector(".visual-stage");
const timer = document.querySelector(".timer-track span");
const heroCopy = document.querySelector(".hero-copy");
const quoteLayer = document.querySelector(".quote-layer");
const quotePanel = document.querySelector(".quote-panel");
const formView = document.querySelector("[data-form-view]");
const successView = document.querySelector("[data-success-view]");
const form = document.querySelector("#quote-form");
let active = 0;
let carouselHandle = null;
let heroVisible = true;
let lastFocused = null;

const existingHeroImage = stage.querySelector(".hero-image");
slides.forEach((slide, index) => {
  const image = index === 0 ? existingHeroImage : document.createElement("div");
  image.className = `hero-image${index === 0 ? " is-active" : ""}`;
  image.style.backgroundImage = `url("${slide.image}")`;
  image.setAttribute("aria-hidden", index === 0 ? "false" : "true");
  image.dataset.slide = String(index);
  if (index > 0) stage.insertBefore(image, stage.querySelector(".hero-shade"));
});

function restartTimerAnimation() {
  timer.style.animation = "none";
  void timer.offsetWidth;
  timer.style.animation = `timer ${CAROUSEL_MS}ms linear forwards`;
  timer.style.animationPlayState = quoteLayer.classList.contains("is-open") || !heroVisible ? "paused" : "running";
}

function renderThumbnails() {
  const container = document.querySelector("[data-thumbnails]");
  const upcoming = [1, 2].map(step => (active + step) % slides.length);
  container.replaceChildren();

  upcoming.forEach((index, position) => {
    const slide = slides[index];
    const button = document.createElement("button");
    button.className = "thumb-card";
    button.type = "button";
    button.setAttribute("aria-label", `Ver ${slide.short}`);
    button.innerHTML = `
      <span class="thumb-photo" style="background-image:url('${slide.image}')"></span>
      <span class="thumb-number">0${index + 1}</span>
      <span class="thumb-meta"><b>${slide.short}</b><small>${slide.metric}</small></span>
      <span class="thumb-arrow" aria-hidden="true">→</span>
      ${position === 0 ? '<span class="thumb-progress"></span>' : ""}
    `;
    button.addEventListener("click", () => goTo(index));
    container.append(button);
  });
}

function renderSlide() {
  const slide = slides[active];
  document.querySelectorAll(".hero-image").forEach((image, index) => {
    const isActive = index === active;
    image.classList.toggle("is-active", isActive);
    image.setAttribute("aria-hidden", String(!isActive));
  });
  document.querySelector("[data-hero-kicker]").textContent = slide.kicker;
  document.querySelector("[data-hero-title]").textContent = slide.title;
  document.querySelector("[data-hero-title2]").textContent = slide.title2;
  document.querySelector("[data-hero-description]").textContent = slide.description;
  document.querySelector("[data-current]").textContent = `0${active + 1}`;
  document.querySelector("[data-progress]").style.width = `${((active + 1) / slides.length) * 100}%`;
  heroCopy.classList.remove("is-refreshing");
  void heroCopy.offsetWidth;
  heroCopy.classList.add("is-refreshing");
  renderThumbnails();
  restartTimerAnimation();
}

function scheduleCarousel() {
  window.clearTimeout(carouselHandle);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !heroVisible || quoteLayer.classList.contains("is-open")) return;
  carouselHandle = window.setTimeout(() => goTo(active + 1), CAROUSEL_MS);
}

function goTo(index) {
  active = (index + slides.length) % slides.length;
  renderSlide();
  scheduleCarousel();
}

function openQuote() {
  lastFocused = document.activeElement;
  formView.hidden = false;
  successView.hidden = true;
  quoteLayer.classList.add("is-open");
  quoteLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  timer.style.animationPlayState = "paused";
  window.clearTimeout(carouselHandle);
  window.setTimeout(() => quotePanel.querySelector("input")?.focus(), 300);
}

function closeQuote() {
  quoteLayer.classList.remove("is-open");
  quoteLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocused instanceof HTMLElement) lastFocused.focus();
  restartTimerAnimation();
  scheduleCarousel();
}

document.querySelectorAll(".js-open-quote").forEach(button => button.addEventListener("click", openQuote));
document.querySelectorAll("[data-close-quote]").forEach(button => button.addEventListener("click", closeQuote));
document.querySelector("[data-prev]").addEventListener("click", () => goTo(active - 1));
document.querySelector("[data-next]").addEventListener("click", () => goTo(active + 1));

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Hola NavyComex, quiero cotizar una importación.",
    `Nombre o empresa: ${data.get("name") || ""}`,
    `Producto: ${data.get("product") || ""}`,
    `País de origen: ${data.get("origin") || "Por definir"}`,
    `Mi WhatsApp: ${data.get("phone") || ""}`
  ].join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  formView.hidden = true;
  successView.hidden = false;
  successView.querySelector("button").focus();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && quoteLayer.classList.contains("is-open")) closeQuote();
  if (!heroVisible || quoteLayer.classList.contains("is-open")) return;
  if (event.key === "ArrowRight") goTo(active + 1);
  if (event.key === "ArrowLeft") goTo(active - 1);
});

document.querySelectorAll(".faq-list details").forEach(item => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-list details").forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    timer.style.animationPlayState = heroVisible ? "running" : "paused";
    scheduleCarousel();
  }, { threshold: 0.25 });
  observer.observe(hero);
}

renderThumbnails();
restartTimerAnimation();
scheduleCarousel();
