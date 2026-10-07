# Control Café 2.0 · Web MVP v3

Versión web independiente del proyecto Flutter/Codex para empezar a probar la lógica de Control Café 2.0.

## Probar
Abrí `index.html` en un navegador moderno. Para una experiencia más estable en Mac:

```bash
cd control-cafe-2-web
python3 -m http.server 8000
```

Luego abrí `http://localhost:8000`.

Los datos se guardan en el almacenamiento local del navegador.

## Publicar en GitHub Pages
1. Creá un repositorio nuevo, por ejemplo `control-cafe-2-web`.
2. Subí `index.html`, `styles.css`, `app.js` y este README a la raíz.
3. GitHub → Settings → Pages → Deploy from a branch → rama principal → `/ (root)` → Save.
4. GitHub te dará la dirección pública del sitio.

Los PDF se generan en el navegador con jsPDF cargado desde jsDelivr, por lo que la descarga de PDF requiere conexión a Internet.

## Alcance
Solo cápsulas. No vasos térmicos, mangas ni tazas. Incluye carga del día anterior, totales hoy/semana laboral/mes, dispenser, cierre diario, control de cajas (50 cápsulas; sugerencia desde 75%), cierres semanal y mensual, historial e informes PDF diarios/semanales/mensuales.

Los informes contienen únicamente cápsulas utilizadas por variedad/color.


## Ajuste de cierre diario
La tabla de cierre muestra variedad, color, disponible y restante. El consumo calculado se presenta en la vista previa inferior para evitar duplicar información.

## v3
Los colores se muestran junto al nombre de cada variedad en las tablas y cierres; se eliminan columnas de color duplicadas. Los PDF también incluyen un indicador visual de color por variedad.
