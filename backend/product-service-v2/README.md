# Microservicio de Productos Farmacéuticos

API REST para gestión de productos de farmacia usando FastAPI, PostgreSQL y Docker Compose.

## Características

✅ CRUD completo de productos farmacéuticos
✅ Gestión de tipos de productos
✅ Carga de imágenes (base64)
✅ Filtros y búsqueda
✅ Base de datos PostgreSQL
✅ Documentación automática (Swagger)
✅ Dockerizado

## Estructura del Proyecto

```
pharmacy-api/
├── main.py              # Aplicación FastAPI
├── requirements.txt     # Dependencias Python
├── Dockerfile          # Imagen Docker
├── docker-compose.yml  # Orquestación de servicios
├── .env.example        # Variables de entorno ejemplo
├── .gitignore         # Archivos ignorados por Git
└── README.md          # Este archivo
```

## Instalación y Ejecución

### Prerrequisitos

- Docker
- Docker Compose

### Pasos

1. **Clonar/crear el proyecto**

```bash
mkdir pharmacy-api
cd pharmacy-api
```

2. **Crear los archivos** (main.py, Dockerfile, docker-compose.yml, requirements.txt)

3. **Iniciar los servicios**

```bash
docker-compose up -d
```

4. **Verificar que estén corriendo**

```bash
docker-compose ps
```

5. **Ver logs**

```bash
docker-compose logs -f api
```

## Acceso a la API

- **API**: http://localhost:8000
- **Documentación interactiva (Swagger)**: http://localhost:8000/docs
- **Documentación alternativa (ReDoc)**: http://localhost:8000/redoc

## Base de Datos

La base de datos PostgreSQL está disponible en:

- **Host**: localhost
- **Puerto**: 5432
- **Usuario**: postgres
- **Contraseña**: postgres
- **Base de datos**: pharmacy_db

## Endpoints Principales

### Tipos de Producto

- `POST /product-types/` - Crear tipo de producto
- `GET /product-types/` - Listar tipos
- `GET /product-types/{id}` - Obtener tipo específico

### Productos

- `POST /products/` - Crear producto
- `GET /products/` - Listar productos (con filtros opcionales)
- `GET /products/{id}` - Obtener producto específico
- `PUT /products/{id}` - Actualizar producto
- `DELETE /products/{id}` - Eliminar producto

### Imágenes

- `POST /products/{id}/images/` - Subir imagen
- `DELETE /products/{id}/images/{image_id}` - Eliminar imagen

## Ejemplos de Uso

### 1. Crear un tipo de producto

```bash
curl -X POST "http://localhost:8000/product-types/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analgésico",
    "description": "Medicamentos para alivio del dolor"
  }'
```

### 2. Crear un producto

```bash
curl -X POST "http://localhost:8000/products/" \
  -H "Content-Type: application/json" \
  -d '{
    "product_type_id": 1,
    "chemical_name": "Paracetamol",
    "commercial_name": "Tempra",
    "description": "Analgésico y antipirético",
    "price": 45.50,
    "expiration_date": "2026-12-31",
    "stock": 100,
    "batch": "LOT2024001",
    "supplier": "Distribuidora Farmacéutica XYZ",
    "pharmaceutical": "Bayer"
  }'
```

### 3. Listar productos

```bash
curl -X GET "http://localhost:8000/products/"
```

### 4. Filtrar por tipo de producto

```bash
curl -X GET "http://localhost:8000/products/?product_type_id=1"
```

### 5. Subir imagen de producto

```bash
curl -X POST "http://localhost:8000/products/1/images/" \
  -F "file=@producto.jpg" \
  -F "is_primary=true"
```

### 6. Actualizar stock de un producto

```bash
curl -X PUT "http://localhost:8000/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 150
  }'
```

## Modelo de Datos

### ProductType

- `id`: Integer (Primary Key)
- `name`: String (único)
- `description`: Text (opcional)

### Product

- `id`: Integer (Primary Key)
- `product_type_id`: Integer (Foreign Key)
- `chemical_name`: String (opcional)
- `commercial_name`: String (requerido)
- `description`: Text (opcional)
- `price`: Float (requerido, > 0)
- `expiration_date`: Date (opcional)
- `stock`: Integer (default: 0)
- `batch`: String (opcional)
- `supplier`: String (opcional)
- `pharmaceutical`: String (opcional)
- `created_at`: DateTime
- `updated_at`: DateTime

### ProductImage

- `id`: Integer (Primary Key)
- `product_id`: Integer (Foreign Key)
- `image_data`: Text (Base64)
- `is_primary`: Boolean

## Comandos Útiles

### Detener servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (borra la BD)

```bash
docker-compose down -v
```

### Reconstruir imágenes

```bash
docker-compose build
```

### Ver logs en tiempo real

```bash
docker-compose logs -f
```

### Acceder al contenedor de la API

```bash
docker exec -it pharmacy_api bash
```

### Acceder a PostgreSQL

```bash
docker exec -it pharmacy_db psql -U postgres -d pharmacy_db
```

## Desarrollo

Para desarrollo local sin Docker:

1. Crear entorno virtual

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows
```

2. Instalar dependencias

```bash
pip install -r requirements.txt
```

3. Configurar variable de entorno

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pharmacy_db"
```

4. Ejecutar la aplicación

```bash
uvicorn main:app --reload
```

## Mejoras Futuras

- [ ] Autenticación y autorización (JWT)
- [ ] Paginación mejorada
- [ ] Búsqueda de texto completo
- [ ] Alertas de stock bajo
- [ ] Notificaciones de productos próximos a caducar
- [ ] Almacenamiento de imágenes en S3/MinIO
- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline
- [ ] Métricas y monitoring

## Licencia

MIT
