# Enosfera · landing "Señal CRT"

Versión alternativa de la landing de Enosfera para creadores y productores, con la estética de TV retro del kit "Señal CRT" (barras de señal, grano, scanlines, glitch, televisores y terminal). Mantiene los colores y todo el contenido de la landing principal.

- **Sitio publicado:** https://lucasfloreslucero-agil.github.io/enosfera-crt/
- **Landing principal (sin cambios):** https://lucasfloreslucero-agil.github.io/enosfera/
- **Publicación:** GitHub Pages desde la rama `main`. Cada push actualiza el sitio.
- **Estado:** en revisión, con `noindex`.

## Estructura

- `index.html` — la página completa (sitio estático, sin build).
- `assets/css/tokens.css` — tokens del sistema de diseño de Enosfera; la página usa el modo oscuro (`data-theme="dark"`).
- `assets/css/crt.css` — el kit adaptado: tokens con la paleta de Enosfera, capas de pantalla, hero, televisores, terminal, canales, glitch, sección fija de preventas y modal.
- `assets/js/crt.js` — efectos: barras de señal en el hero, encabezado con blur, revelado palabra por palabra, isotipo que se dibuja con el scroll, revelado al entrar en pantalla y email para copiar.
- `assets/js/form.js` — modal de postulación y gráfico de comunidades, igual que en la landing principal.
- `scripts/dev-server.js` — servidor local: `node scripts/dev-server.js` → http://localhost:4324

## Del kit a Enosfera

| Kit | Acá |
|---|---|
| Fondo negro y acento teal | Fondo Tinta noche (`#0B1524`) y acento Arcilla (`#EE9C7E`) |
| Barras SMPTE | Barras con Piedra, Torrontés, Tinta, Jarilla y Arcilla |
| Sección roja de contraste | Preventas sobre Tinta 600 |
| CTA final en teal | CTA final en Arcilla 700, con el segundo renglón en Torrontés |
| SVG del "∞" dibujado por el scroll | El isotipo de Enosfera: el aro se dibuja y el segmento de vino se llena en el paso 4 |
| Resultados en televisores | Panel de ejemplo y ejemplo de cobro en televisores |
| Lista de canales | Qué podés vender, con glitch en los títulos |

Se respetan las reglas de marca: sin emoji ni caracteres como íconos (se usan íconos Lucide y puntos en CSS), leyenda de consumo responsable y Botón de arrepentimiento. Con "reducir movimiento" activado se apagan grano, parpadeos y animaciones.

## Formulario

Envía a la misma planilla de Google Sheets que la landing principal ("Enosfera · Postulaciones de creadores"). Las postulaciones de las dos versiones llegan mezcladas. Para probar sin enviar nada: `?demo=ok` o `?demo=error`.

## Pendientes

Los mismos de la landing principal: mail de contacto y links legales provisorios, cargo por servicio ilustrativo y sacar `noindex` si se elige esta versión.
