# Guía de Configuración del Proyecto Sorteo-Lux-Vips

Este proyecto consta de dos partes:
1. **Frontend**: React + Vite (Puerto 8080)
2. **Backend**: Node.js + Express + MongoDB (Puerto 5000)

## Requisitos Previos

- Node.js (v18 o superior)
- npm
- Cuenta en MongoDB Atlas (para la base de datos)
- Cuenta en Cloudinary (para subir imágenes)

## Configuración para Desarrollo Local

### 1. Configurar Variables de Entorno

El proyecto ya tiene configurados los archivos `.env` necesarios:

- **Frontend** (`/`): `.env` apunta al backend local.
  ```env
  VITE_BACKEND_URL=http://localhost:5000
  ```

- **Backend** (`/server`): `.env` contiene las credenciales (MongoDB, JWT, Cloudinary).

### 2. Instalar Dependencias

Debes instalar las dependencias tanto en la raíz (frontend) como en la carpeta `server` (backend).

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
cd ..
```

### 3. Ejecutar el Proyecto

Para que la aplicación funcione correctamente, debes ejecutar **ambos** servidores (frontend y backend) simultáneamente.

Abre dos terminales:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*Debe mostrar: "Conexión exitosa a MongoDB Atlas" y "Servidor corriendo en puerto 5000"*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Abre http://localhost:8080/ en tu navegador.*

## Solución de Problemas Comunes

### "No se pudieron cargar las rifas finalizadas"
- Asegúrate de que el backend esté corriendo en el puerto 5000.
- Verifica que el archivo `.env` en la raíz tenga `VITE_BACKEND_URL=http://localhost:5000`.

### Error de conexión a MongoDB
- Verifica que tu IP esté permitida en MongoDB Atlas (Network Access).
- Verifica que la `MONGO_URI` en `server/.env` sea correcta.

## Despliegue a Producción

El proyecto está configurado para desplegarse en:
- **Frontend**: Vercel (URL: `https://raffle-project-portfolio.vercel.app/`)
- **Backend**: Render (URL: `https://sorteo-lux-vips.onrender.com`)

En producción, el frontend usa el archivo `.env.production` que apunta automáticamente al backend de Render.
