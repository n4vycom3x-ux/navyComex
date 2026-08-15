# NavyComex — sitio web estático

Proyecto listo para publicarse en GitHub Pages, Netlify, Cloudflare Pages o cualquier hosting estático. No requiere Node.js, paquetes ni compilación.

## Archivos principales

- `index.html`: contenido y metadatos del sitio.
- `styles.css`: diseño completo y adaptación para celulares, tablets y computadoras.
- `script.js`: carrusel automático de 14 segundos, controles, teclado, preguntas frecuentes y panel de cotización.
- `assets/`: logo e imágenes del sitio.

## Publicar con GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube **todo el contenido de esta carpeta** a la rama `main`.
3. En GitHub abre `Settings` → `Pages`.
4. En `Build and deployment`, elige `Deploy from a branch`.
5. Selecciona la rama `main`, la carpeta `/ (root)` y guarda.

GitHub mostrará la dirección pública cuando termine la publicación.

## Vista local

Puedes abrir `index.html` directamente. Para una prueba más fiel, usa un servidor local, por ejemplo:

```bash
python3 -m http.server 8080
```

Después visita `http://localhost:8080`.

## Contacto y formulario

La burbuja flotante abre el WhatsApp de NavyComex (`+591 73004453`) con un mensaje preparado. El formulario también arma la solicitud con los datos del cliente y la abre en WhatsApp para que pueda enviarla. El correo visible y enlazado es `n4vy.com3x@gmail.com`.

La sección de ubicación muestra el punto exacto de la oficina de NavyComex identificado por Google Maps como `FRG2+JWG`, en la zona Antofagasta, Distrito 3, El Alto, La Paz, e integra el mapa proporcionado.

Si el número o el mensaje cambian, actualiza `WHATSAPP_NUMBER` al inicio de `script.js` y los enlaces `wa.me` de `index.html`.
