# 🗂️ Backend API para Dashboard Kanban (Laravel)

Este repositorio contiene el backend (**API RESTful**) desarrollado en **Laravel**, utilizado por el Dashboard Kanban creado en React.  
Su objetivo principal es gestionar los **trabajos**, permitiendo su creación, lectura, actualización (incluyendo movimiento entre columnas) y eliminación.

---

## 🛠️ Requisitos del Sistema

- **PHP:** 8.2 o superior  
- **Composer**  
- **Base de Datos:** MySQL o PostgreSQL  
- **Git**  

---

## 📦 Instalación (Entorno Local)

Sigue estos pasos para configurar el proyecto en tu máquina local:

---

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nombre-del-repo-backend.git
cd nombre-del-repo-backend

---

### Instalar dependencias
```bash
composer install

### Configurar el archivo .env
```bash
cp .env.example .env

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombre_de_tu_db
DB_USERNAME=root
DB_PASSWORD=

### Generar clave de aplicación
```bash
php artisan key:generate

### Ejecutar Migraciones
```bash
php artisan migrate

### Con seeders:
```bash
php artisan db:seed

### Inicia el servidor local en http://127.0.0.1:8000:
```bash
php artisan serve

Método	Ruta	        Acción CRUD	            Uso
GET	    /api/jobs	    READ (listar)	        Cargar todos los trabajos
POST	/api/jobs	    CREATE (crear)	        Agregar un trabajo
PUT	    /api/jobs/{id}	UPDATE (editar/mover)	Editar datos o mover columnas
PATCH	/api/jobs/{id}	UPDATE (parcial)	    Actualización parcial
DELETE	/api/jobs/{id}	DELETE (eliminar)	    Borrar un trabajo