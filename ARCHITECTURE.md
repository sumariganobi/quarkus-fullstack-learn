# Modular Architecture Guide

## 📦 Struktur Project Modular

```
quarkus-crud-app/
├── pom.xml                          # Parent POM
├── common/                          # Shared utilities
│   ├── pom.xml
│   └── src/main/java/com/example/common/
│       ├── dto/
│       ├── exception/
│       └── util/
├── product-module/                  # Product Module
│   ├── pom.xml
│   └── src/main/java/com/example/product/
│       ├── entity/Product.java
│       ├── resource/ProductResource.java
│       ├── service/ProductService.java
│       └── dto/
├── warehouse-module/                # Warehouse Module (NEW)
│   ├── pom.xml
│   └── src/main/java/com/example/warehouse/
│       ├── entity/Warehouse.java
│       ├── resource/WarehouseResource.java
│       ├── service/WarehouseService.java
│       └── dto/
├── frontend/                        # Frontend Module
│   ├── pom.xml
│   └── src/main/resources/META-INF/resources/
│       ├── index.html
│       ├── products/
│       │   ├── products.html
│       │   └── products.js
│       └── warehouse/
│           ├── warehouse.html
│           └── warehouse.js
└── app/                            # Main Application
    ├── pom.xml
    └── src/main/
        ├── java/com/example/
        │   └── Application.java
        └── resources/
            ├── application.properties
            └── db/migration/
```

## 🎯 Keuntungan Modular:

1. **Separation of Concerns** - Setiap module punya tanggung jawab sendiri
2. **Reusability** - Module bisa dipakai di project lain
3. **Team Collaboration** - Tim bisa kerja di module berbeda
4. **Independent Deployment** - Bisa deploy module tertentu saja
5. **Easy Testing** - Test per module lebih mudah
6. **Scalability** - Mudah tambah module baru

## 📝 Cara Membuat Module Baru:

### 1. Buat folder module baru
```bash
mkdir warehouse-module
cd warehouse-module
```

### 2. Buat pom.xml untuk module
```xml
<project>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>quarkus-crud-app</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <artifactId>warehouse-module</artifactId>
</project>
```

### 3. Buat Entity, Service, Resource
Sama seperti Product module

### 4. Update parent pom.xml
```xml
<modules>
    <module>common</module>
    <module>product-module</module>
    <module>warehouse-module</module>
    <module>frontend</module>
    <module>app</module>
</modules>
```

### 5. Build semua module
```bash
mvn clean install
```

## 🔌 Cara Install/Add Module:

### Option 1: Include di pom.xml
```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>warehouse-module</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

### Option 2: Dynamic Module Loading (Advanced)
Gunakan Quarkus Extensions atau CDI

### Option 3: Microservices
Pisahkan jadi service terpisah dan komunikasi via REST/gRPC

## 🚀 Migration Path:

### Step 1: Refactor Current Code
1. Extract Product code ke module
2. Extract common code ke shared module
3. Update dependencies

### Step 2: Add New Module
1. Create warehouse-module
2. Implement Warehouse features
3. Add to parent POM

### Step 3: Update Frontend
1. Create warehouse UI
2. Add navigation between modules
3. Share common components

## 📦 Alternative: Plugin Architecture

Gunakan Quarkus Extensions untuk true plugin system:
```bash
quarkus create-extension warehouse
```
