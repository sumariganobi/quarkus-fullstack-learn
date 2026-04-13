# Quarkus CRUD Application

Aplikasi REST API CRUD sederhana menggunakan Quarkus (Imperative) dengan MariaDB dan Flyway migration.

## Teknologi yang Digunakan

- **Quarkus 3.8.1** - Framework Java
- **Hibernate ORM with Panache** - ORM untuk database
- **MariaDB** - Database
- **Flyway** - Database migration
- **JAX-RS (REST)** - REST API
- **Bean Validation** - Validasi input
- **Maven** - Build tool

## Prasyarat

- **Java 21 LTS** ([Download Java 21](https://adoptium.net/temurin/releases/?version=21))
- Maven 3.8+ (atau gunakan Maven Wrapper yang sudah disediakan)
- MySQL 8.0 atau MariaDB 10.x

## Setup Database

1. Install dan jalankan MySQL 8.0
2. Buat database baru:

```sql
CREATE DATABASE quarkus_db;
CREATE USER 'ns'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON quarkus_db.* TO 'ns'@'localhost';
FLUSH PRIVILEGES;
```

3. **Setup credentials (IMPORTANT!):**

   **Option A: Using .env file (Recommended)**
   ```bash
   # Copy template
   cp .env.example .env
   
   # Edit .env with your actual credentials
   # The .env file is already in .gitignore
   ```

   **Option B: Using environment variables**
   ```powershell
   # Windows PowerShell
   $env:DB_USERNAME="ns"
   $env:DB_PASSWORD="your_password"
   $env:DB_URL="jdbc:mysql://localhost:3306/quarkus_db?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC"
   ```

   **Option C: Using profile**
   ```bash
   # Copy template
   cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties
   
   # Edit application-local.properties with your credentials
   # Run with: ./mvnw quarkus:dev -Dquarkus.profile=local
   ```

⚠️ **NEVER commit real credentials to git!** See [SECURITY.md](SECURITY.md) for details.

## Menjalankan Aplikasi

### Development Mode

```bash
./mvnw quarkus:dev
```

Atau di Windows:

```bash
mvnw.cmd quarkus:dev
```

Aplikasi akan berjalan di `http://localhost:8080`

### Production Mode

```bash
./mvnw clean package
java -jar target/quarkus-app/quarkus-run.jar
```

## API Endpoints

### 1. Get All Products

```http
GET http://localhost:8080/api/products
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High performance laptop",
    "price": 15000000.00,
    "stock": 10,
    "createdAt": "2026-04-10T10:00:00",
    "updatedAt": "2026-04-10T10:00:00"
  }
]
```

### 2. Search Products by Name

```http
GET http://localhost:8080/api/products?name=laptop
```

### 3. Get Product by ID

```http
GET http://localhost:8080/api/products/1
```

### 4. Create Product

```http
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "name": "Monitor",
  "description": "27 inch 4K monitor",
  "price": 3500000.00,
  "stock": 15
}
```

### 5. Update Product

```http
PUT http://localhost:8080/api/products/1
Content-Type: application/json

{
  "name": "Laptop Updated",
  "description": "Updated description",
  "price": 16000000.00,
  "stock": 8
}
```

### 6. Delete Product

```http
DELETE http://localhost:8080/api/products/1
```

## Struktur Project

```
.
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── ProductRequest.java
│   │   │   │   └── ProductResponse.java
│   │   │   ├── entity/           # Entity classes
│   │   │   │   └── Product.java
│   │   │   ├── exception/        # Exception handling
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── resource/         # REST endpoints
│   │   │   │   └── ProductResource.java
│   │   │   └── service/          # Business logic
│   │   │       └── ProductService.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/     # Flyway migrations
│   │           └── V1__create_product_table.sql
│   └── test/                     # Test files
├── pom.xml
└── README.md
```

## Fitur

✅ **CRUD Operations** - Create, Read, Update, Delete
✅ **Database Migration** - Flyway untuk versioning database
✅ **Validation** - Bean Validation untuk input
✅ **Error Handling** - Global exception handler
✅ **Search** - Search products by name
✅ **Timestamps** - Auto-generated created_at dan updated_at
✅ **DTO Pattern** - Separation of concerns dengan Request/Response DTOs

## Database Migration

Flyway akan otomatis menjalankan migration saat aplikasi start. File migration ada di:
`src/main/resources/db/migration/`

Untuk membuat migration baru, buat file dengan format:
`V{version}__{description}.sql`

Contoh: `V2__add_category_column.sql`

## Testing dengan cURL

### Create Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Headset","description":"Gaming headset","price":750000.00,"stock":20}'
```

### Get All Products
```bash
curl http://localhost:8080/api/products
```

### Get Product by ID
```bash
curl http://localhost:8080/api/products/1
```

### Update Product
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop Pro","description":"Updated laptop","price":17000000.00,"stock":5}'
```

### Delete Product
```bash
curl -X DELETE http://localhost:8080/api/products/1
```

## Tips Development

- Gunakan **Quarkus Dev Mode** untuk hot reload
- Akses **Dev UI** di `http://localhost:8080/q/dev/`
- Lihat **Health Check** di `http://localhost:8080/q/health`
- Monitor **Metrics** di `http://localhost:8080/q/metrics`

## Troubleshooting

### Database Connection Error
- Pastikan MariaDB sudah running
- Cek username, password, dan database name di `application.properties`
- Pastikan database `quarkus_db` sudah dibuat

### Port Already in Use
Ubah port di `application.properties`:
```properties
quarkus.http.port=8081
```

## Lisensi

MIT License
