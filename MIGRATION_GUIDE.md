# Migration Guide - Multi-Module Maven

## 🏗️ Struktur Baru

```
quarkus-crud-app/
├── pom-parent.xml                 # Parent POM (rename to pom.xml)
├── common-module/
│   ├── pom.xml
│   └── src/main/java/com/example/common/
│       ├── dto/
│       └── exception/
├── product-module/
│   ├── pom.xml
│   └── src/main/java/com/example/product/
│       ├── dto/
│       ├── entity/
│       ├── resource/
│       └── service/
├── warehouse-module/
│   ├── pom.xml
│   └── src/main/java/com/example/warehouse/
│       ├── dto/
│       ├── entity/
│       ├── resource/
│       └── service/
├── frontend-module/
│   ├── pom.xml
│   └── src/main/resources/META-INF/resources/
│       ├── index.html
│       ├── products.html
│       ├── products.js
│       ├── warehouses.html
│       └── warehouses.js
└── app-module/
    ├── pom.xml
    └── src/main/resources/
        ├── application.properties
        └── db/migration/
            ├── V1__create_product_table.sql
            └── V2__create_warehouse_table.sql
```

## 📝 Manual Migration Steps

### Step 1: Backup Current Project
```bash
# Create backup
cp -r . ../quarkus-crud-app-backup
```

### Step 2: Rename Parent POM
```bash
# Backup old pom.xml
mv pom.xml pom-old.xml

# Rename parent POM
mv pom-parent.xml pom.xml
```

### Step 3: Move Common Files

**Exception Handler:**
```bash
mkdir -p common-module/src/main/java/com/example/common/exception
mv src/main/java/com/example/exception/* common-module/src/main/java/com/example/common/exception/
```

### Step 4: Move Product Module Files

**Product Entity:**
```bash
mkdir -p product-module/src/main/java/com/example/product/entity
mv src/main/java/com/example/entity/Product.java product-module/src/main/java/com/example/product/entity/
```

**Product DTOs:**
```bash
mkdir -p product-module/src/main/java/com/example/product/dto
mv src/main/java/com/example/dto/ProductRequest.java product-module/src/main/java/com/example/product/dto/
mv src/main/java/com/example/dto/ProductResponse.java product-module/src/main/java/com/example/product/dto/
```

**Product Service:**
```bash
mkdir -p product-module/src/main/java/com/example/product/service
mv src/main/java/com/example/service/ProductService.java product-module/src/main/java/com/example/product/service/
```

**Product Resource:**
```bash
mkdir -p product-module/src/main/java/com/example/product/resource
mv src/main/java/com/example/resource/ProductResource.java product-module/src/main/java/com/example/product/resource/
```

### Step 5: Move Warehouse Module Files

**Warehouse Entity:**
```bash
mkdir -p warehouse-module/src/main/java/com/example/warehouse/entity
mv src/main/java/com/example/entity/Warehouse.java warehouse-module/src/main/java/com/example/warehouse/entity/
```

**Warehouse DTOs:**
```bash
mkdir -p warehouse-module/src/main/java/com/example/warehouse/dto
mv src/main/java/com/example/dto/WarehouseRequest.java warehouse-module/src/main/java/com/example/warehouse/dto/
mv src/main/java/com/example/dto/WarehouseResponse.java warehouse-module/src/main/java/com/example/warehouse/dto/
```

**Warehouse Service:**
```bash
mkdir -p warehouse-module/src/main/java/com/example/warehouse/service
mv src/main/java/com/example/service/WarehouseService.java warehouse-module/src/main/java/com/example/warehouse/service/
```

**Warehouse Resource:**
```bash
mkdir -p warehouse-module/src/main/java/com/example/warehouse/resource
mv src/main/java/com/example/resource/WarehouseResource.java warehouse-module/src/main/java/com/example/warehouse/resource/
```

### Step 6: Move Frontend Files

```bash
mkdir -p frontend-module/src/main/resources/META-INF/resources
mv src/main/resources/META-INF/resources/* frontend-module/src/main/resources/META-INF/resources/
```

### Step 7: Move App Module Files

```bash
mkdir -p app-module/src/main/resources
mv src/main/resources/application.properties app-module/src/main/resources/
mv src/main/resources/db app-module/src/main/resources/
```

### Step 8: Update Package Names

You need to update import statements in all Java files:

**Common Module:**
- `com.example.exception` → `com.example.common.exception`

**Product Module:**
- `com.example.entity.Product` → `com.example.product.entity.Product`
- `com.example.dto.ProductRequest` → `com.example.product.dto.ProductRequest`
- `com.example.dto.ProductResponse` → `com.example.product.dto.ProductResponse`
- `com.example.service.ProductService` → `com.example.product.service.ProductService`
- `com.example.resource.ProductResource` → `com.example.product.resource.ProductResource`

**Warehouse Module:**
- `com.example.entity.Warehouse` → `com.example.warehouse.entity.Warehouse`
- `com.example.dto.WarehouseRequest` → `com.example.warehouse.dto.WarehouseRequest`
- `com.example.dto.WarehouseResponse` → `com.example.warehouse.dto.WarehouseResponse`
- `com.example.service.WarehouseService` → `com.example.warehouse.service.WarehouseService`
- `com.example.resource.WarehouseResource` → `com.example.warehouse.resource.WarehouseResource`

### Step 9: Build All Modules

```bash
# From root directory
mvn clean install

# Run application
cd app-module
mvn quarkus:dev
```

## 🚀 Quick Migration Script (PowerShell)

```powershell
# Create directories
New-Item -ItemType Directory -Force -Path common-module/src/main/java/com/example/common/exception
New-Item -ItemType Directory -Force -Path product-module/src/main/java/com/example/product/{entity,dto,service,resource}
New-Item -ItemType Directory -Force -Path warehouse-module/src/main/java/com/example/warehouse/{entity,dto,service,resource}
New-Item -ItemType Directory -Force -Path frontend-module/src/main/resources/META-INF/resources
New-Item -ItemType Directory -Force -Path app-module/src/main/resources

# Backup
Copy-Item pom.xml pom-old.xml
Copy-Item pom-parent.xml pom.xml

Write-Host "Directories created. Now manually move files according to the guide above."
```

## ⚠️ Important Notes

1. **Package Names**: All imports must be updated to new package structure
2. **Build Order**: Maven will build modules in order: common → product → warehouse → frontend → app
3. **Dependencies**: Each module only depends on what it needs
4. **Testing**: Test each module independently before running the app

## 🎯 Benefits After Migration

- ✅ True modularity
- ✅ Independent versioning per module
- ✅ Reusable modules in other projects
- ✅ Better team collaboration
- ✅ Cleaner separation of concerns
