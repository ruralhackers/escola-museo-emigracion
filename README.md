# Escola Museo da Emigración · Galegos: As máns de América

Web de una sola página, contada como un viaje en 12 escenas con parallax por capas.
Hecha con Vite, React, TypeScript, Tailwind, Framer Motion y Lenis. Las ilustraciones son SVG propios y las fuentes están autoalojadas.

## Abrir en local

```bash
npm i && npm run dev        # http://localhost:5173
```

## Publicar

```bash
npm run build               # genera dist/
npm run preview             # prueba local de dist/ en http://localhost:4173
```

`dist/` es la web estática lista para publicar, sin servidor ni base de datos. Puedes subirla a Netlify, Vercel, Cloudflare Pages, GitHub Pages o cualquier hosting. Las rutas son relativas (`base: './'`), así que también funciona desde una subcarpeta.

Después de publicar, cambia `og:image` en `index.html` por la URL absoluta de `og.png` (por ejemplo `https://tu-dominio/og.png`). Así las redes sociales mostrarán bien la vista previa.

## Dónde se cambia cada cosa

- **Textos:** `src/content/gl.json` (galego), `src/content/es.json` (español) y `src/content/en.json` (inglés). Los tres archivos tienen exactamente las mismas claves: si añades o cambias una, hazlo en los tres. Los textos de la interfaz (botones, etiquetas del formulario, mensajes de error, descripciones de las ilustraciones) están en la clave `ui`, y el título y la descripción de la página en `meta`.
- **Idiomas:** `src/lib/i18n.tsx`. Hook `useT()` / `useI18n()`.
- **Contacto y email del formulario:** claves `identity`, `form` y `footer` de los tres archivos de idioma. El email de destino (mercadodelatiani@gmail.com) está en `src/scenes/S11Apoya.tsx`.
- **Escenas:** `src/scenes/S01Puerto.tsx` … `S12Footer.tsx`.
- **Ilustraciones** (barcos, maleta, sellos, casas, mapas): `src/art/`. Cada capa es un componente SVG y se puede cambiar por una imagen (`<img>`) sin tocar la animación.
- **Colores y tipografías:** `tailwind.config.js` y `src/art/palette.ts`.

## Notas

- El formulario no guarda datos. Al enviarlo se abre el programa de correo del visitante con la carta ya escrita para mercadodelatiani@gmail.com. Si el correo no se abre, la carta se puede copiar o abrir de nuevo desde la propia web.
- Accesibilidad: la web respeta `prefers-reduced-motion` y tiene un interruptor «Reducir movimiento», que se recuerda en el navegador. También tiene enlace para saltar al contenido y se puede usar entera con el teclado. El sonido está apagado por defecto.
- En móvil y con movimiento reducido, las escenas se muestran como capítulos apilados, sin secciones fijadas.
- La web está en tres idiomas: galego, español e inglés. El selector GL | ES | EN está en la barra superior, también en móvil, y cambia el idioma al momento, sin recargar la página.
- Idioma al entrar: primero `?lang=gl`, `?lang=es` o `?lang=en` en la URL; si no, la última elección del visitante (se guarda en el navegador con la clave `eme-lang`); si no, el idioma del navegador (gallego, español o inglés). En cualquier otro caso, español.
- Al cambiar de idioma se actualizan `<html lang>`, el título y la meta descripción. El `index.html` estático (lo que ven los buscadores sin JavaScript) sigue en español.
- La carta del formulario se escribe en el idioma elegido. Los nombres de país salen del navegador. Algunos navegadores no traen nombres en gallego, así que los países más relacionados con la emigración gallega llevan su nombre en gallego en `src/lib/countries.ts`.
