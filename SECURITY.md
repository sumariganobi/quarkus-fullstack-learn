# Security Guidelines

## Database Credentials

### ⚠️ NEVER commit these files:
- `.env`
- `.env.local`
- `application-local.properties`
- Any file containing real passwords

### ✅ Safe to commit:
- `.env.example` (template with dummy values)
- `application-dev.properties` (with default/dummy values)
- `application-prod.properties` (using environment variables)

## Setup for New Developers

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with real credentials:**
   ```
   DB_USERNAME=your_username
   DB_PASSWORD=your_actual_password
   DB_URL=jdbc:mysql://localhost:3306/quarkus_db
   ```

3. **Verify `.env` is in `.gitignore`:**
   ```bash
   git check-ignore .env
   # Should output: .env
   ```

## Production Deployment

### Use Environment Variables:
```bash
export DB_USERNAME=prod_user
export DB_PASSWORD=secure_password
export DB_URL=jdbc:mysql://prod-server:3306/quarkus_db

java -jar target/quarkus-app/quarkus-run.jar
```

### Or use Docker secrets:
```yaml
services:
  app:
    environment:
      - DB_USERNAME_FILE=/run/secrets/db_username
      - DB_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_username
      - db_password
```

## Checking for Leaked Credentials

Before committing:
```bash
# Check if sensitive files are staged
git status

# Search for passwords in staged files
git diff --cached | grep -i password
```

## If Credentials Are Leaked

1. **Immediately change the password**
2. **Remove from git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push (if necessary)**
4. **Notify team members**
