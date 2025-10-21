# Shenna's Studio - Railway Architecture & Data Flow

## Complete Railway Architecture with Environment Variables

```mermaid
flowchart TB
    subgraph Internet["🌐 Public Internet"]
        Users["👥 Customers<br/>shennastudio.com"]
        Admins["👨‍💼 Admin Users<br/>api.shennastudio.com/app"]
    end
    
    subgraph Railway["☁️ Railway.app Infrastructure"]
        subgraph DBServices["💾 Database Services (Auto-Configured)"]
            PG["🐘 PostgreSQL<br/>━━━━━━━━━━━━<br/>DATABASE_URL<br/>POSTGRES_USER<br/>POSTGRES_PASSWORD<br/>POSTGRES_DB"]
            Redis["🔴 Redis Cache<br/>━━━━━━━━━━━━<br/>REDIS_URL<br/>REDIS_PASSWORD<br/>REDISUSER"]
        end
        
        subgraph AppServices["🚀 Application Services"]
            Backend["⚙️ Medusa Backend<br/>Port: 9000<br/>━━━━━━━━━━━━<br/>Required:<br/>• DATABASE_URL ↓<br/>• REDIS_URL ↓<br/>• JWT_SECRET<br/>• COOKIE_SECRET<br/>• STORE_CORS<br/>• ADMIN_CORS<br/>• STRIPE_API_KEY<br/>━━━━━━━━━━━━<br/>Provides:<br/>• REST API<br/>• Admin Panel (/app)<br/>• Publishable Key"]
            
            Frontend["🎨 Next.js Frontend<br/>Port: 3000<br/>━━━━━━━━━━━━<br/>Required:<br/>• NEXT_PUBLIC_MEDUSA_BACKEND_URL ↑<br/>• NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ↑<br/>• NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY<br/>• NEXTAUTH_SECRET<br/>━━━━━━━━━━━━<br/>Provides:<br/>• Storefront UI<br/>• Product Pages<br/>• Checkout Flow"]
        end
    end
    
    subgraph External["🔌 External Services"]
        Stripe["💳 Stripe<br/>━━━━━━━━━━━━<br/>Backend:<br/>STRIPE_API_KEY<br/>STRIPE_SECRET_KEY<br/>━━━━━━━━━━━━<br/>Frontend:<br/>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]
        
        Algolia["🔍 Algolia Search<br/>(Optional)<br/>━━━━━━━━━━━━<br/>ALGOLIA_APPLICATION_ID<br/>NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY<br/>ALGOLIA_ADMIN_API_KEY"]
        
        Cloudinary["🖼️ Cloudinary Images<br/>(Optional)<br/>━━━━━━━━━━━━<br/>CLOUDINARY_CLOUD_NAME<br/>CLOUDINARY_API_KEY<br/>CLOUDINARY_API_SECRET"]
    end
    
    %% Database Connections
    Backend -->|DATABASE_URL=${{PostgreSQL.DATABASE_URL}}| PG
    Backend -->|REDIS_URL=${{Redis.REDIS_URL}}| Redis
    
    %% Application Connections
    Frontend -->|NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com| Backend
    Frontend -->|API Requests<br/>Product Data<br/>Cart Operations| Backend
    
    %% External Service Connections
    Backend -->|STRIPE_SECRET_KEY| Stripe
    Frontend -->|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY| Stripe
    Backend -.->|Optional| Algolia
    Frontend -.->|Optional| Algolia
    Frontend -.->|Optional| Cloudinary
    
    %% User Connections
    Users -->|HTTPS| Frontend
    Admins -->|HTTPS| Backend
    Users -->|Checkout| Frontend
    Frontend -->|Payment Intent| Backend
    Backend -->|Process Payment| Stripe
    
    style PG fill:#336791,stroke:#fff,stroke-width:2px,color:#fff
    style Redis fill:#DC382D,stroke:#fff,stroke-width:2px,color:#fff
    style Backend fill:#9B59B6,stroke:#fff,stroke-width:2px,color:#fff
    style Frontend fill:#61DAFB,stroke:#000,stroke-width:2px,color:#000
    style Stripe fill:#635BFF,stroke:#fff,stroke-width:2px,color:#fff
    style Algolia fill:#5468FF,stroke:#fff,stroke-width:2px,color:#fff
    style Cloudinary fill:#3448C5,stroke:#fff,stroke-width:2px,color:#fff
    style Users fill:#2ECC71,stroke:#000,stroke-width:2px,color:#000
    style Admins fill:#E74C3C,stroke:#fff,stroke-width:2px,color:#fff
```

---

## Environment Variable Flow Diagram

```mermaid
sequenceDiagram
    participant RW as Railway Platform
    participant PG as PostgreSQL Service
    participant RD as Redis Service
    participant BE as Backend Service
    participant FE as Frontend Service
    participant User as End User
    
    Note over RW,RD: Step 1: Railway Auto-Configuration
    RW->>PG: Create & Configure PostgreSQL
    PG-->>RW: DATABASE_URL, POSTGRES_USER, POSTGRES_PASSWORD
    RW->>RD: Create & Configure Redis
    RD-->>RW: REDIS_URL, REDIS_PASSWORD
    
    Note over BE: Step 2: Backend Configuration
    RW->>BE: Inject DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
    RW->>BE: Inject REDIS_URL=${{Redis.REDIS_URL}}
    Note over BE: Manual: JWT_SECRET, COOKIE_SECRET<br/>ADMIN_EMAIL, ADMIN_PASSWORD<br/>STRIPE_API_KEY, CORS settings
    BE->>PG: Connect using DATABASE_URL
    BE->>RD: Connect using REDIS_URL
    BE->>BE: Run migrations (AUTO_MIGRATE=true)
    BE->>BE: Create admin user (AUTO_CREATE_ADMIN=true)
    BE-->>RW: Backend Ready + Publishable Key
    
    Note over FE: Step 3: Frontend Configuration
    Note over FE: Manual: NEXT_PUBLIC_MEDUSA_BACKEND_URL<br/>NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY<br/>NEXTAUTH_SECRET<br/>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    FE->>BE: Connect using NEXT_PUBLIC_MEDUSA_BACKEND_URL
    FE-->>RW: Frontend Ready
    
    Note over User,FE: Step 4: User Interaction
    User->>FE: Visit shennastudio.com
    FE->>BE: Fetch products & data
    BE->>PG: Query database
    BE->>RD: Check cache
    RD-->>BE: Cached data or miss
    PG-->>BE: Product data
    BE-->>FE: JSON response
    FE-->>User: Render storefront
```

---

## Railway Service Dependencies

```mermaid
graph LR
    subgraph "Deploy Order"
        A[1. PostgreSQL] --> B[2. Redis]
        B --> C[3. Backend]
        C --> D[4. Frontend]
    end
    
    subgraph "Environment Variable Dependencies"
        C -->|Requires DATABASE_URL| A
        C -->|Requires REDIS_URL| B
        D -->|Requires Backend URL| C
        D -->|Requires Publishable Key| C
    end
    
    style A fill:#336791,color:#fff
    style B fill:#DC382D,color:#fff
    style C fill:#9B59B6,color:#fff
    style D fill:#61DAFB,color:#000
```

---

## Complete Environment Variable Mapping

### 🔵 PostgreSQL Service → Backend Service

| PostgreSQL Variable | Backend Variable | How It's Used |
|---------------------|------------------|---------------|
| `DATABASE_URL` | `DATABASE_URL=${{PostgreSQL.DATABASE_URL}}` | Main database connection string |
| `POSTGRES_USER` | (Included in DATABASE_URL) | Database authentication |
| `POSTGRES_PASSWORD` | (Included in DATABASE_URL) | Database authentication |
| `POSTGRES_DB` | (Included in DATABASE_URL) | Database name |

**Connection Example:**
```
postgresql://postgres:FJXRirnGBaMfpTcMOeRpfquikOtvVKpa@postgres.railway.internal:5432/railway
```

---

### 🔴 Redis Service → Backend Service

| Redis Variable | Backend Variable | How It's Used |
|----------------|------------------|---------------|
| `REDIS_URL` | `REDIS_URL=${{Redis.REDIS_URL}}` | Cache & event bus connection |
| `REDIS_PASSWORD` | (Included in REDIS_URL) | Redis authentication |
| `REDISHOST` | (Included in REDIS_URL) | Redis server host |
| `REDISPORT` | (Included in REDIS_URL) | Redis server port |

**Connection Example:**
```
redis://default:PAQmOYTJrbfQzOwxOqdSWmKHIIiSUylU@redis.railway.internal:6379
```

---

### ⚙️ Backend Service → Frontend Service

| Backend Provides | Frontend Requires | How It's Used |
|------------------|-------------------|---------------|
| Public API URL | `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | API endpoint for all requests |
| Publishable Key | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | API authentication |
| Admin Panel | (Access via browser) | Admin management interface |

**Frontend Configuration Example:**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01JKM7N8P9Q0R1S2T3U4V5W6X7
```

---

## Data Flow: Customer Makes Purchase

```mermaid
sequenceDiagram
    actor Customer
    participant FE as Frontend<br/>(shennastudio.com)
    participant BE as Backend<br/>(api.shennastudio.com)
    participant PG as PostgreSQL
    participant RD as Redis
    participant ST as Stripe
    
    Customer->>FE: Browse products
    FE->>BE: GET /store/products<br/>[NEXT_PUBLIC_MEDUSA_BACKEND_URL]
    BE->>RD: Check cache
    alt Cache Hit
        RD-->>BE: Cached product data
    else Cache Miss
        BE->>PG: Query products table
        PG-->>BE: Product data
        BE->>RD: Store in cache
    end
    BE-->>FE: Product JSON
    FE-->>Customer: Display products
    
    Customer->>FE: Add to cart
    FE->>BE: POST /store/carts<br/>[Uses Publishable Key]
    BE->>RD: Store cart session
    BE->>PG: Create cart record
    BE-->>FE: Cart confirmation
    
    Customer->>FE: Checkout
    FE->>BE: POST /store/carts/{id}/payment-sessions
    BE->>ST: Create Payment Intent<br/>[STRIPE_API_KEY]
    ST-->>BE: Client Secret
    BE-->>FE: Payment session
    FE->>ST: Process payment<br/>[NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY]
    ST-->>FE: Payment confirmed
    FE->>BE: POST /store/carts/{id}/complete
    BE->>PG: Create order record
    BE->>PG: Update inventory
    BE->>RD: Publish order.placed event
    BE-->>FE: Order confirmation
    FE-->>Customer: Thank you page
```

---

## Admin Workflow: Managing Products

```mermaid
sequenceDiagram
    actor Admin
    participant Browser
    participant BE as Backend<br/>(api.shennastudio.com/app)
    participant PG as PostgreSQL
    participant RD as Redis
    
    Admin->>Browser: Visit /app
    Browser->>BE: GET /app
    BE-->>Browser: Admin panel HTML/JS
    
    Admin->>Browser: Login
    Browser->>BE: POST /auth/user/emailpass<br/>{email, password}
    BE->>PG: Verify credentials
    PG-->>BE: User data
    BE->>BE: Generate JWT token<br/>[JWT_SECRET]
    BE-->>Browser: Set session cookie<br/>[COOKIE_SECRET]
    
    Admin->>Browser: Create product
    Browser->>BE: POST /admin/products<br/>[Bearer Token]
    BE->>BE: Verify JWT token
    BE->>PG: Insert product
    BE->>RD: Invalidate product cache
    BE->>RD: Publish product.created event
    PG-->>BE: Product created
    BE-->>Browser: Product JSON
    Browser-->>Admin: Success message
```

---

## Security Flow: CORS & Authentication

```mermaid
flowchart TB
    subgraph "Request Flow with Environment Variables"
        A[User Request]
        B{Origin Check}
        C[Check STORE_CORS]
        D[Check ADMIN_CORS]
        E[Check AUTH_CORS]
        F{Has JWT?}
        G[Verify JWT_SECRET]
        H{Has Cookie?}
        I[Verify COOKIE_SECRET]
        J[Allow Request]
        K[Reject Request]
        
        A --> B
        B -->|Store API| C
        B -->|Admin API| D
        B -->|Auth API| E
        
        C -->|Origin Match| F
        D -->|Origin Match| F
        E -->|Origin Match| F
        
        C -->|No Match| K
        D -->|No Match| K
        E -->|No Match| K
        
        F -->|Yes| G
        F -->|No| H
        
        G -->|Valid| J
        G -->|Invalid| K
        
        H -->|Yes| I
        H -->|No| K
        
        I -->|Valid| J
        I -->|Invalid| K
    end
    
    style J fill:#2ECC71,color:#fff
    style K fill:#E74C3C,color:#fff
```

**Environment Variables Used:**
- `STORE_CORS` - Allowed origins for storefront API calls
- `ADMIN_CORS` - Allowed origins for admin panel
- `AUTH_CORS` - Allowed origins for authentication
- `JWT_SECRET` - Validates Bearer tokens
- `COOKIE_SECRET` - Validates session cookies

---

## Railway Service Configuration Matrix

| Service | Root Directory | Build Command | Start Command | Port | Health Check |
|---------|---------------|---------------|---------------|------|--------------|
| PostgreSQL | N/A | Auto | Auto | 5432 | Auto |
| Redis | N/A | Auto | Auto | 6379 | Auto |
| Backend | `ocean-backend` | `npm install && npm run build` | `npm start` | 9000 | `/health` |
| Frontend | `/` or empty | `npm install && npm run build` | `npm start` | 3000 | `/` |

---

## Critical Environment Variable Summary

### 🔐 Security Secrets (Generate with OpenSSL)

```bash
# Backend
JWT_SECRET=<64 chars>           # openssl rand -hex 32
COOKIE_SECRET=<64 chars>        # openssl rand -hex 32
ADMIN_PASSWORD=<32 chars>       # openssl rand -base64 24

# Frontend
NEXTAUTH_SECRET=<44 chars>      # openssl rand -base64 32
```

### 🔗 Service References (Use Railway Variables)

```bash
# Backend
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}

# Frontend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.shennastudio.com
# OR
NEXT_PUBLIC_MEDUSA_BACKEND_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
```

### 🌐 CORS Configuration (Production Domains)

```bash
# Backend
STORE_CORS=https://shennastudio.com,https://www.shennastudio.com
ADMIN_CORS=https://api.shennastudio.com
AUTH_CORS=https://shennastudio.com,https://api.shennastudio.com
```

### 💳 External Services (Get from Provider Dashboards)

```bash
# Stripe (Required)
STRIPE_API_KEY=sk_live_...        # Backend
STRIPE_SECRET_KEY=sk_live_...     # Backend
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Frontend

# Algolia (Optional)
ALGOLIA_APPLICATION_ID=...
ALGOLIA_ADMIN_API_KEY=...
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=...

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## Deployment Sequence

```mermaid
gantt
    title Railway Deployment Timeline
    dateFormat X
    axisFormat %S
    
    section Infrastructure
    Create Railway Project           :done, infra1, 0, 5
    Add PostgreSQL Service           :done, infra2, 5, 10
    Add Redis Service                :done, infra3, 10, 15
    
    section Backend
    Configure Backend Service        :active, back1, 15, 25
    Set Environment Variables        :active, back2, 25, 35
    Deploy Backend                   :active, back3, 35, 95
    Run Migrations                   :active, back4, 95, 110
    Create Admin User                :active, back5, 110, 115
    
    section Admin Panel
    Access Admin Panel               :active, admin1, 115, 120
    Get Publishable Key              :active, admin2, 120, 125
    
    section Frontend
    Configure Frontend Service       :active, front1, 125, 135
    Set Environment Variables        :active, front2, 135, 145
    Add Publishable Key              :active, front3, 145, 150
    Deploy Frontend                  :active, front4, 150, 210
    
    section DNS
    Configure Custom Domains         :active, dns1, 210, 230
    Verify SSL Certificates          :active, dns2, 230, 240
    
    section Testing
    Test Storefront                  :active, test1, 240, 250
    Test Admin Panel                 :active, test2, 250, 260
    Test Checkout Flow               :active, test3, 260, 280
```

**Estimated Total Time:** ~5-6 minutes per service (excluding DNS propagation)

---

## Troubleshooting Decision Tree

```mermaid
flowchart TD
    Start[Deployment Issue?]
    Start --> Q1{Which service?}
    
    Q1 -->|Backend| B1{Can connect to database?}
    Q1 -->|Frontend| F1{Can reach backend?}
    
    B1 -->|No| B2[Check DATABASE_URL<br/>Verify PostgreSQL is running]
    B1 -->|Yes| B3{Can connect to Redis?}
    
    B3 -->|No| B4[Check REDIS_URL<br/>Verify Redis is running]
    B3 -->|Yes| B5{Build successful?}
    
    B5 -->|No| B6[Check build logs<br/>Verify dependencies]
    B5 -->|Yes| B7[Check JWT_SECRET<br/>Check COOKIE_SECRET<br/>Check CORS settings]
    
    F1 -->|No| F2[Check NEXT_PUBLIC_MEDUSA_BACKEND_URL<br/>Verify backend is deployed]
    F1 -->|Yes| F3{Has publishable key?}
    
    F3 -->|No| F4[Get from admin panel:<br/>Settings → Publishable API Keys]
    F3 -->|Yes| F5{Stripe configured?}
    
    F5 -->|No| F6[Add STRIPE keys<br/>Use live keys not test]
    F5 -->|Yes| F7[Check CORS in backend<br/>Check NEXTAUTH_SECRET]
    
    style Start fill:#3498DB,color:#fff
    style B2 fill:#E74C3C,color:#fff
    style B4 fill:#E74C3C,color:#fff
    style B6 fill:#E74C3C,color:#fff
    style F2 fill:#E74C3C,color:#fff
    style F4 fill:#F39C12,color:#000
    style F6 fill:#F39C12,color:#000
```

---

## Summary

✅ **4 Railway Services**
- PostgreSQL (auto-configured)
- Redis (auto-configured)
- Backend (18 required + 5 optional variables)
- Frontend (8 required + 8 optional variables)

✅ **Key Configuration Points**
1. PostgreSQL & Redis: Zero configuration needed
2. Backend: References database services, requires secrets
3. Frontend: References backend service, requires publishable key
4. External: Stripe required, Algolia/Cloudinary optional

✅ **Critical Path**
1. Deploy infrastructure (PostgreSQL, Redis)
2. Configure & deploy backend
3. Get publishable key from admin panel
4. Configure & deploy frontend
5. Set up custom domains
6. Test end-to-end flow

---

**Documentation Version:** 1.0  
**Last Updated:** January 2025  
**Compatible With:** Railway (Latest), Medusa 2.10.1, Next.js 15.5.3