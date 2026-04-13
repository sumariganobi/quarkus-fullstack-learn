# Quarkus Modular CRUD Application

Aplikasi REST API CRUD modular menggunakan Quarkus (Imperative) dengan MySQL dan Flyway migration.

## 🏗️ Arsitektur Modular

Aplikasi ini dibangun dengan arsitektur modular yang memisahkan setiap fitur menjadi module independen:

```
quarkus-crud-app/
├── Dashboard (/)                    # Halaman utama dengan statistik
├── Products Module (/products.html) # Module manajemen produk
└── Warehouse Module (/warehouses.html) # Module manajemen gudang
```

### Keuntungan Modular:
- ✅ **Separation of Concerns** - Setiap module independen
- ✅ **Easy to Extend** - Tambah module baru tanpa ubah yang lama
- ✅ **Team Collaboration** - Tim bisa kerja di module berbeda
- ✅ **Maintainable** - Mudah maintain dan debug per module

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

### Products Module

#### 1. Get All Products

```http
GET http://localhost:8080/api/products
```

#### 2. Search Products by Name

```http
GET http://localhost:8080/api/products?name=laptop
```

#### 3. Get Product by ID

```http
GET http://localhost:8080/api/products/1
```

#### 4. Create Product

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

#### 5. Update Product

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

#### 6. Delete Product

```http
DELETE http://localhost:8080/api/products/1
```

### Warehouse Module

#### 1. Get All Warehouses

```http
GET http://localhost:8080/api/warehouses
```

#### 2. Search by Location

```http
GET http://localhost:8080/api/warehouses?location=Jakarta
```

#### 3. Get Available Warehouses

```http
GET http://localhost:8080/api/warehouses?available=true
```

#### 4. Get Warehouse by ID

```http
GET http://localhost:8080/api/warehouses/1
```

#### 5. Create Warehouse

```http
POST http://localhost:8080/api/warehouses
Content-Type: application/json

{
  "name": "Warehouse Bandung",
  "location": "Bandung",
  "address": "Jl. Soekarno Hatta No. 789",
  "capacity": 5000,
  "currentStock": 2000
}
```

#### 6. Update Warehouse

```http
PUT http://localhost:8080/api/warehouses/1
Content-Type: application/json

{
  "name": "Warehouse Jakarta Updated",
  "location": "Jakarta",
  "address": "Updated address",
  "capacity": 12000,
  "currentStock": 8000
}
```

#### 7. Delete Warehouse

```http
DELETE http://localhost:8080/api/warehouses/1
```

## Struktur Project

```
.
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── ProductRequest.java
│   │   │   │   ├── ProductResponse.java
│   │   │   │   ├── WarehouseRequest.java
│   │   │   │   └── WarehouseResponse.java
│   │   │   ├── entity/           # Entity classes
│   │   │   │   ├── Product.java
│   │   │   │   └── Warehouse.java
│   │   │   ├── exception/        # Exception handling
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── resource/         # REST endpoints (Controllers)
│   │   │   │   ├── ProductResource.java
│   │   │   │   └── WarehouseResource.java
│   │   │   └── service/          # Business logic
│   │   │       ├── ProductService.java
│   │   │       └── WarehouseService.java
│   │   └── resources/
│   │       ├── META-INF/resources/  # Frontend files
│   │       │   ├── index.html       # Dashboard
│   │       │   ├── products.html    # Products Module UI
│   │       │   ├── products.js      # Products Module Logic
│   │       │   ├── warehouses.html  # Warehouse Module UI
│   │       │   └── warehouses.js    # Warehouse Module Logic
│   │       ├── application.properties
│   │       └── db/migration/     # Flyway migrations
│   │           ├── V1__create_product_table.sql
│   │           └── V2__create_warehouse_table.sql
│   └── test/                     # Test files
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Template for .env
├── docker-compose.yml            # Docker setup
├── pom.xml                       # Maven configuration
├── ARCHITECTURE.md               # Architecture documentation
├── SECURITY.md                   # Security guidelines
└── README.md
```

## Fitur

### ✅ Backend Features:
- **Modular Architecture** - Setiap module independen
- **CRUD Operations** - Create, Read, Update, Delete untuk Products & Warehouses
- **Database Migration** - Flyway untuk versioning database
- **Validation** - Bean Validation untuk input
- **Error Handling** - Global exception handler
- **Search** - Search products by name, warehouses by location
- **Timestamps** - Auto-generated created_at dan updated_at
- **DTO Pattern** - Separation of concerns dengan Request/Response DTOs

### ✅ Frontend Features:
- **Dashboard** - Halaman utama dengan statistik dan navigasi
- **Products Module** - Full CRUD UI untuk products
- **Warehouse Module** - Full CRUD UI untuk warehouses
- **Responsive Design** - Mobile-friendly dengan Tailwind CSS
- **Real-time Updates** - Auto-refresh setelah CRUD operations
- **Modern UI** - Gradient backgrounds, shadows, animations
- **Navigation** - Easy navigation antar modules

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
