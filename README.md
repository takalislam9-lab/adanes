# Webs de barberías — Plantilla reutilizable (SEO local + CMS)

Este repositorio contiene **demos de páginas web para barberías/peluquerías de
Alcobendas**, construidas con la misma plantilla reutilizable para poder
adaptarla rápido a cada cliente sin empezar de cero.

## Demos incluidas

| Cliente | Carpeta | URL de demo | Reserva |
|---------|---------|-------------|---------|
| **Peluquería y Barbería Adanes** | `/` (raíz) | `/` | WhatsApp / teléfono |
| **Be Loyal Barbería y Peluquería** | `/be-loyal/` | `/be-loyal/` | Booksy / Instagram |

> Para adaptar la plantilla a un **nuevo cliente**: copia la carpeta `be-loyal/`
> con otro nombre, edita los archivos de `content/*.json` (datos, servicios,
> tarifas, galería, testimonios, horario) y los textos de SEO en `index.html`
> (title, description, JSON-LD, dirección y mapa). El diseño y el código no hay
> que tocarlos.

> ⚠️ **Datos pendientes de confirmar en Be Loyal:** teléfono, horario real y
> valoración de Google no se pudieron verificar. La reserva apunta a **Booksy**
> e **Instagram** (canales reales), el horario es de ejemplo y las opiniones son
> de muestra. Sustituye todo por los datos reales desde el panel `/be-loyal/admin/`.

---

## Peluquería y Barbería Adanes — Sitio web

Sitio web profesional, responsivo y optimizado para **SEO local** de
**Peluquería y Barbería Adanes** (Calle del Fuego 43, Alcobendas).

Incluye un **panel de gestión visual** (Decap CMS / Netlify CMS) para que el
cliente edite el contenido **sin tocar código**: servicios, tarifas, fotos del
lookbook, testimonios y horarios.

- **Stack:** HTML5 semántico · Tailwind CSS (CDN) · JavaScript moderno (sin framework)
- **Sin build:** es un sitio 100% estático. Se puede abrir directamente y desplegar tal cual.
- **Panel de administración:** `/admin/`

---

## 📁 Estructura del proyecto

```
adanes/
├── index.html              # Página principal (Hero, Servicios, Tarifas, Lookbook, Opiniones, Contacto)
├── admin/
│   ├── index.html          # Panel Decap CMS
│   └── config.yml          # Configuración de las colecciones editables
├── assets/
│   ├── css/styles.css      # Estilos personalizados (sobre Tailwind)
│   ├── js/main.js          # Carga el contenido y controla la interacción
│   └── img/
│       ├── favicon.svg
│       ├── logo.svg
│       └── uploads/        # Fotos que sube el cliente desde el panel
├── content/                # CONTENIDO EDITABLE (lo modifica el CMS)
│   ├── config.json         # Datos del negocio (teléfono, WhatsApp, dirección…)
│   ├── horario.json        # Horario semanal
│   ├── servicios.json      # Servicios destacados (3 tarjetas)
│   ├── tarifas.json        # Precios de barbería y peluquería
│   ├── galeria.json        # Lookbook / galería de trabajos
│   └── testimonios.json    # Opiniones de clientes
├── sitemap.xml             # Mapa del sitio para Google
├── robots.txt
├── netlify.toml            # Configuración de Netlify
└── README.md
```

---

## 🚀 Ver el sitio en local

Al usar `fetch()` para cargar el contenido, ábrelo con un servidor local
(no con doble clic sobre el archivo):

```bash
# Con Python
python3 -m http.server 8080

# o con Node
npx serve .
```

Luego visita `http://localhost:8080`.

---

## 🌐 Publicar en Netlify + activar el panel del cliente

1. **Sube el proyecto a GitHub** (ya está en este repositorio).
2. En [Netlify](https://app.netlify.com) → **Add new site → Import from Git** y
   selecciona este repositorio. No hace falta comando de build; *publish directory* = `.`.
3. **Activa el panel de gestión (Decap CMS):**
   - Netlify → **Site settings → Identity → Enable Identity**.
   - **Identity → Services → Git Gateway → Enable Git Gateway**.
   - **Identity → Registration** → ponlo en *Invite only*.
   - **Identity → Invite users** → invita al email del cliente.
   - El cliente recibe un correo, crea su contraseña y ya puede entrar en
     `https://TU-SITIO.netlify.app/admin/` para editar todo.
4. **Formulario de contacto:** Netlify Forms lo detecta automáticamente
   (el formulario ya lleva `data-netlify="true"`). Verás las respuestas en
   Netlify → **Forms**.

> Si el dominio final no es `main`, edita `branch:` en `admin/config.yml`.

---

## ✏️ Qué puede editar el cliente (sin código)

Desde `/admin/`, con estas secciones:

| Sección del panel        | Qué controla                                             |
|--------------------------|----------------------------------------------------------|
| ⚙️ Datos del negocio     | Teléfono, WhatsApp, dirección, valoración, texto del hero |
| 🕒 Horario               | Horas de cada día de la semana                            |
| ✂️ Servicios destacados  | Las 3 tarjetas grandes de servicios                       |
| 💶 Tarifas y precios     | Lista de precios de barbería y de peluquería              |
| 📸 Galería / Lookbook    | Subir fotos de trabajos y su categoría (Cortes/Barba/Color) |
| ⭐ Testimonios           | Opiniones de clientes y nota media                        |

Cada cambio genera un commit en el repositorio y Netlify vuelve a publicar el
sitio automáticamente en segundos.

---

## 🔎 SEO local incluido

- Etiquetas `<title>`, `meta description` y `keywords` orientadas a búsquedas
  como *barbería en Alcobendas*, *peluquería de caballeros Alcobendas*,
  *arreglo de barba calle del fuego* y *mejor degradado en Alcobendas*.
- **Datos estructurados** `schema.org/HairSalon` con dirección, horario,
  geolocalización y valoración media (4.6 ★, 191 reseñas) → habilita
  resultados enriquecidos en Google.
- `sitemap.xml`, `robots.txt`, Open Graph y Twitter Cards.
- Etiquetas `geo.*` para posicionamiento local.

### Tras publicar, recuerda:
1. Cambiar el dominio de ejemplo `https://adanespeluqueros.es/` por el dominio
   real en: `index.html` (canonical, Open Graph, JSON-LD), `sitemap.xml` y `robots.txt`.
2. Dar de alta el sitio en **Google Search Console** y enviar el `sitemap.xml`.
3. Enlazar la **ficha de Google Business Profile** del negocio.

---

## 🛠️ Personalización rápida

- **Colores / tipografías:** en `index.html`, dentro de `tailwind.config` y en `assets/css/styles.css` (variables `--gold`, `--ink`).
- **Mapa:** el `iframe` de Google Maps ya apunta a *Calle del Fuego 43, Alcobendas*.
- **Foto de portada del Hero:** cámbiala en el `<img>` de la sección `#inicio`.
