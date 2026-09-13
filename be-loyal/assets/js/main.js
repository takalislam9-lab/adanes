/* ============================================================
   Be Loyal · Barbería y Peluquería
   Carga el contenido editable desde /content/*.json (Decap CMS)
   y controla la interacción de la página.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Utilidad: escapa texto para insertarlo con seguridad en HTML
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (e) {
      console.warn("No se pudo cargar", path, e);
      return null;
    }
  }

  // Iconos SVG para los servicios estrella
  const ICONS = {
    scissors:
      '<path stroke-linecap="round" stroke-linejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243z"/>',
    razor:
      '<path stroke-linecap="round" stroke-linejoin="round" d="M7 7l10 10M5 21l4-4m0 0l6.5-6.5a2.121 2.121 0 013 3L12 20H8v-4z"/>',
    sparkles:
      '<path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>',
  };

  function starsSVG(n, size = "w-4 h-4") {
    let out = "";
    for (let i = 1; i <= 5; i++) {
      const cls = i <= n ? "text-gold" : "text-gray-600";
      out +=
        '<svg class="' + size + " " + cls + '" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.175 0l-3.366 2.446c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.362-1.118L2.05 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z"/></svg>';
    }
    return out;
  }

  /* -------------------- CONFIG / ENLACES DINÁMICOS -------------------- */
  async function initConfig() {
    const c = await loadJSON("content/config.json");
    if (!c) return;

    // Texto del hero
    if (c.descripcion_hero) { const el = $("#hero-desc"); if (el) el.textContent = c.descripcion_hero; }

    // Enlace de reserva (Booksy) — todos los botones con clase .js-reserva
    if (c.reserva_url) {
      $$(".js-reserva").forEach((el) => { el.href = c.reserva_url; });
    }

    // Enlace de Instagram — todos los elementos con clase .js-instagram
    if (c.instagram) {
      $$(".js-instagram").forEach((el) => { el.href = c.instagram; });
    }

    // Enlaces de teléfono (opcional: solo si hay número configurado)
    if (c.telefono_link) {
      const tel = "tel:" + c.telefono_link.replace(/\s+/g, "");
      $$(".js-telefono").forEach((el) => { el.setAttribute("href", tel); });
    }
  }

  /* -------------------- SERVICIOS ESTRELLA -------------------- */
  async function initServicios() {
    const grid = $("#servicios-grid");
    if (!grid) return;
    const data = await loadJSON("content/servicios.json");
    const items = (data && data.servicios) || [];
    grid.innerHTML = items
      .map((s) => {
        const icon = ICONS[s.icono] || ICONS.scissors;
        const detalles = (s.detalles || [])
          .map(
            (d) =>
              '<li class="flex items-start gap-2 text-sm text-gray-400"><svg class="w-4 h-4 text-gold mt-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span>' +
              esc(d) +
              "</span></li>"
          )
          .join("");
        return (
          '<article class="reveal card-hover bg-ink2 border border-white/10 rounded-2xl p-7">' +
          '<div class="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-5">' +
          '<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24">' + icon + "</svg></div>" +
          '<h3 class="font-display text-xl font-semibold mb-2">' + esc(s.titulo) + "</h3>" +
          '<p class="text-gray-400 text-sm mb-5 leading-relaxed">' + esc(s.descripcion) + "</p>" +
          '<ul class="space-y-2">' + detalles + "</ul>" +
          "</article>"
        );
      })
      .join("");
    observeReveal();
  }

  /* -------------------- TARIFAS -------------------- */
  function tarifaCard(item) {
    const destac = item.destacado
      ? "border-gold/60 bg-gold/5"
      : "border-white/10 bg-ink";
    const badge = item.destacado
      ? '<span class="text-[10px] uppercase tracking-wider font-bold bg-gold text-ink px-2 py-0.5 rounded-full">Top</span>'
      : "";
    return (
      '<div class="flex items-start justify-between gap-4 border ' + destac + ' rounded-xl p-4">' +
      "<div>" +
      '<div class="flex items-center gap-2 mb-1"><h4 class="font-semibold">' + esc(item.nombre) + "</h4>" + badge + "</div>" +
      (item.descripcion ? '<p class="text-gray-400 text-sm">' + esc(item.descripcion) + "</p>" : "") +
      "</div>" +
      '<span class="font-display text-lg text-gold whitespace-nowrap">' + esc(item.precio) + "</span>" +
      "</div>"
    );
  }

  async function initTarifas() {
    const data = await loadJSON("content/tarifas.json");
    if (!data) return;
    const nota = $("#tarifas-nota"); if (nota && data.nota) nota.textContent = data.nota;

    const bar = $("#tarifas-barberia");
    const pel = $("#tarifas-peluqueria");
    if (bar) bar.innerHTML = (data.barberia || []).map(tarifaCard).join("");
    if (pel) pel.innerHTML = (data.peluqueria || []).map(tarifaCard).join("");

    // Conmutador de pestañas
    $$(".tarifa-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        $$(".tarifa-tab").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.classList.toggle("bg-gold", on);
          b.classList.toggle("text-ink", on);
          b.classList.toggle("text-gray-300", !on);
        });
        $("#tarifas-barberia").classList.toggle("hidden", tab !== "barberia");
        $("#tarifas-peluqueria").classList.toggle("hidden", tab !== "peluqueria");
      });
    });
  }

  /* -------------------- GALERÍA / LOOKBOOK -------------------- */
  async function initGaleria() {
    const grid = $("#galeria-grid");
    if (!grid) return;
    const data = await loadJSON("content/galeria.json");
    const items = (data && data.trabajos) || [];

    grid.innerHTML = items
      .map((t, i) => {
        const span = i % 5 === 0 ? "row-span-2" : "";
        return (
          '<figure class="gallery-item gallery-card group relative overflow-hidden rounded-xl border border-white/10 ' + span + '" data-cat="' + esc(t.categoria) + '">' +
          '<img src="' + esc(t.imagen) + '" alt="' + esc(t.titulo) + ' — Be Loyal Barbería Alcobendas" loading="lazy" class="gallery-img w-full h-full object-cover aspect-square" />' +
          '<figcaption class="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">' +
          '<div><span class="text-[10px] uppercase tracking-wider text-gold font-bold">' + esc(t.categoria) + "</span>" +
          '<p class="text-sm font-medium text-white">' + esc(t.titulo) + "</p></div>" +
          "</figcaption></figure>"
        );
      })
      .join("");

    // Filtros
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        $$(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
        $$(".gallery-item", grid).forEach((item) => {
          const show = f === "all" || item.dataset.cat === f;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* -------------------- TESTIMONIOS -------------------- */
  async function initTestimonios() {
    const data = await loadJSON("content/testimonios.json");
    if (!data) return;

    if (data.resumen) {
      const rn = $("#rating-num"); if (rn) rn.textContent = data.resumen.valoracion || "4.6";
      const rc = $("#rating-count"); if (rc) rc.textContent = data.resumen.num_resenas || "";
      const rt = $("#rating-text"); if (rt) rt.textContent = data.resumen.texto || "";
      const rs = $("#rating-stars");
      if (rs) rs.innerHTML = starsSVG(Math.round(parseFloat(data.resumen.valoracion || "4.6")), "w-5 h-5");
    }

    const grid = $("#testimonios-grid");
    if (grid) {
      grid.innerHTML = (data.opiniones || [])
        .map(
          (o) =>
            '<article class="reveal bg-ink border border-white/10 rounded-2xl p-6">' +
            '<div class="flex mb-3">' + starsSVG(o.estrellas || 5) + "</div>" +
            '<p class="text-gray-300 text-sm leading-relaxed mb-4">“' + esc(o.texto) + "”</p>" +
            '<div class="flex items-center gap-3">' +
            '<div class="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center font-semibold text-sm">' +
            esc((o.nombre || "?").charAt(0)) + "</div>" +
            '<div><p class="text-sm font-semibold">' + esc(o.nombre) + "</p>" +
            (o.zona ? '<p class="text-xs text-gray-500">' + esc(o.zona) + "</p>" : "") +
            "</div></div></article>"
        )
        .join("");
      observeReveal();
    }
  }

  /* -------------------- HORARIO -------------------- */
  async function initHorario() {
    const data = await loadJSON("content/horario.json");
    if (!data) return;
    const lista = $("#horario-lista");
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = dias[new Date().getDay()];

    if (lista) {
      lista.innerHTML = (data.dias || [])
        .map((d) => {
          const isHoy = d.dia === hoy;
          const horas = d.cerrado ? '<span class="text-gray-500">Cerrado</span>' : esc(d.horas);
          return (
            '<li class="flex justify-between items-center py-2 ' + (isHoy ? "text-gold font-semibold" : "text-gray-300") + '">' +
            "<span>" + esc(d.dia) + (isHoy ? ' <span class="text-[10px] uppercase tracking-wider bg-gold text-ink px-1.5 py-0.5 rounded ml-1">Hoy</span>' : "") + "</span>" +
            '<span class="text-sm text-right">' + horas + "</span></li>"
          );
        })
        .join("");
    }
    const aviso = $("#horario-aviso"); if (aviso && data.aviso) aviso.textContent = data.aviso;
  }

  /* -------------------- INTERACCIÓN GENERAL -------------------- */
  function initUI() {
    // Año del footer
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    // Menú móvil
    const btn = $("#menu-btn");
    const menu = $("#mobile-menu");
    if (btn && menu) {
      btn.addEventListener("click", () => {
        const open = menu.classList.toggle("hidden") === false;
        btn.setAttribute("aria-expanded", String(open));
      });
      $$(".mobile-link", menu).forEach((a) =>
        a.addEventListener("click", () => menu.classList.add("hidden"))
      );
    }

    // Header con fondo al hacer scroll
    const header = $("#site-header");
    const onScroll = () => {
      if (window.scrollY > 30) header.classList.add("shadow-lg");
      else header.classList.remove("shadow-lg");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mensaje de éxito del formulario (Netlify redirige con ?enviado=1)
    if (new URLSearchParams(location.search).get("enviado")) {
      const ok = $("#form-ok");
      if (ok) { ok.classList.remove("hidden"); ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
    }

    // Resalta el enlace de navegación de la sección visible
    const sections = ["inicio", "servicios", "tarifas", "lookbook", "opiniones", "contacto"];
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            $$(".nav-link").forEach((l) =>
              l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) navObserver.observe(el); });
  }

  /* -------------------- ANIMACIÓN DE APARICIÓN -------------------- */
  let revealObserver;
  function observeReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              revealObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
    }
    $$(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
  }

  /* -------------------- ARRANQUE -------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initUI();
    observeReveal();
    initConfig();
    initServicios();
    initTarifas();
    initGaleria();
    initTestimonios();
    initHorario();
  });
})();
