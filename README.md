# Nexus Operativo

Fuente oficial de politicas, procedimientos, manuales y capacitacion de la compania.

Stack: Next.js 15 + TypeScript + Tailwind (Vercel) | Backend: Google Apps Script | Datos: Google Sheets en Drive.

## Estado

Fase 0 completa: login de punta a punta, layout con sidebar y modo oscuro, modulo de Politicas (categorias, lista, detalle), proxy hacia Apps Script, webhook de revalidacion, PWA basica y backend GAS inicial (carpeta `/gas`).

Funciona en **modo demo sin configurar nada**: usuario `admin@nexus.com`, clave `demo123`, con 2 politicas de ejemplo. Al definir `GAS_URL`, los datos pasan a salir del Sheet.

## Correr en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Subir a GitHub y desplegar en Vercel

```bash
git clone https://github.com/comprasrocoto-dotcom/Nexus-Operativo.git
# copia todos los archivos de este proyecto dentro de la carpeta clonada
cd Nexus-Operativo
git add .
git commit -m "Fase 0: nucleo de la plataforma"
git push origin main
```

En vercel.com: **Add New Project** > importar `Nexus-Operativo` > agregar las variables de `.env.example` > Deploy.

## Conectar el backend (Google Apps Script)

1. Abre el Google Sheets `Nexus_Datos` (ya creado en tu Drive).
2. Extensiones > Apps Script > pega los archivos de la carpeta `/gas`.
3. En Apps Script: Configuracion del proyecto > Propiedades del script > agrega `GAS_API_KEY`, `PEPPER`, `REVALIDATE_SECRET`, `VERCEL_REVALIDATE_URL`.
4. Ejecuta una vez `Setup_crearEstructura()` (crea las 17 hojas con datos semilla) y luego `Util_crearAdmin()` (edita antes correo y clave).
5. Implementar > Nueva implementacion > **Aplicacion web** (ejecutar como: yo / acceso: cualquier persona) > copia la URL.
6. En Vercel agrega `GAS_URL` con esa URL y el mismo `GAS_API_KEY` y `REVALIDATE_SECRET`. Redeploy.
7. Activadores > anade `onEditInstalable` al evento "Al editar": los cambios del Sheet se reflejan solos en la web.

## Estructura

Ver `docs/arquitectura-cgo.md` para la arquitectura completa, modelo de datos de las 17 hojas, matriz de permisos, roadmap y riesgos.
