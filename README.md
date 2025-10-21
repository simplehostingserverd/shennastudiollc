# 🌊 Shenna's Studio - Ocean-Themed E-commerce Platform

A beautiful, ocean-inspired e-commerce platform built with Next.js and Medusa, supporting marine conservation efforts.

![Ocean Store](https://img.shields.io/badge/Ocean-Store-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)
![Medusa](https://img.shields.io/badge/Medusa-2.10.0-purple?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)

## 🎯 Project Overview

**Shenna's Studio** is a family-owned ocean-themed e-commerce platform that celebrates marine life while supporting ocean conservation efforts. Built with modern web technologies, it provides a seamless shopping experience for ocean lovers.

### 🌊 Mission

- **Celebrate Ocean Beauty**: Curated products inspired by marine life
- **Support Conservation**: 10% of proceeds go to ocean conservation efforts
- **Family Business**: Handcrafted with love by a dedicated family
- **Eco-Friendly**: Sustainable practices and materials

## 🏗️ Architecture

```
📦 Shenna's Studio Platform
├── 🎨 Frontend (Next.js 15.5.2)
│   ├── Ocean-themed UI/UX
│   ├── Product catalog & search
│   ├── Shopping cart & checkout
│   └── Responsive design
├── ⚙️  Backend (Medusa 2.10.0)
│   ├── Product management
│   ├── Order processing
│   ├── Admin dashboard
│   └── API endpoints
├── 🗄️  Database (PostgreSQL 15)
├── ⚡ Cache (Redis 7)
└── 🔒 Payment (Stripe Integration)
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Node.js 18+** (for local development)
- **PostgreSQL 15+** (if running without Docker)
- **Redis 7+** (if running without Docker)

### 🐳 Docker Deployment (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/simplehostingserverd/shennastudiollc.git
   cd shennastudiollc
   ```

2. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Launch the application**

   ```bash
   docker-compose up -d --build
   ```

4. **Initialize the database**

   ```bash
   # Run migrations
   docker-compose exec medusa-backend npx medusa db:migrate

   # Create admin user
   docker-compose exec medusa-backend npm run create-admin

   # Seed sample data (optional)
   docker-compose exec medusa-backend npm run seed
   ```

### 🌐 Access Points

| Service         | URL                   | Purpose                      |
| --------------- | --------------------- | ---------------------------- |
| **🛍️ Store**    | http://localhost:3000 | Customer shopping experience |
| **⚙️ Admin**    | http://localhost:9000/app | Store management dashboard   |
| **🔌 API**      | http://localhost:9000 | Backend API endpoints        |
| **🗄️ Database** | localhost:5433        | PostgreSQL database          |
| **⚡ Redis**    | localhost:6379        | Caching layer                |

## 📁 Project Structure

```
shennastudiollc/
├── 🏢 Root Configuration
│   ├── docker-compose.yml      # Orchestrates all services
│   ├── .env.example           # Environment template
│   └── README.md              # This file
│
├── 🎨 frontend/               # Frontend Application
│   ├── app/                   # Next.js App Router
│   │   ├── components/        # Reusable UI components
│   │   ├── api/              # API routes
│   │   ├── cart/             # Shopping cart
│   │   └── products/         # Product pages
│   ├── src/                   # Source utilities
│   │   └── lib/              # Shared libraries
│   ├── public/               # Static assets
│   ├── Dockerfile            # Frontend container
│   └── package.json          # Frontend dependencies
│
└── 🏪 backend/                # Medusa Backend
    ├── src/                   # Backend source code
    │   ├── api/              # API routes
    │   ├── scripts/          # Utility scripts
    │   └── workflows/        # Business logic
    ├── Dockerfile            # Backend container
    └── medusa-config.ts      # Medusa configuration
```

## 🛠️ Development

### Local Development Setup

1. **Install dependencies**

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

2. **Start development servers**

   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

3. **Access development environment**
   - Frontend: http://localhost:3000
   - Admin: http://localhost:9000/app
   - API: http://localhost:9000

### 🔧 Available Scripts

**Frontend (frontend/)**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```

**Backend (backend/)**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run create-admin # Create admin user
npm run seed        # Seed sample data
```

## 🔐 Admin Panel

### Default Login (Change Immediately!)

- **Email**: `admin@shennasstudio.com`
- **Password**: `AdminPassword123!`

### First Setup Steps

1. Login with default credentials
2. **Change password immediately**
3. Update admin email
4. Configure store settings
5. Add your products
6. Set up payment methods
7. Configure shipping options

### Admin Features

- 📦 Product management
- 📋 Order tracking
- 👥 Customer management
- 💳 Payment processing
- 📊 Sales analytics
- ⚙️ Store configuration

## 💳 Payment Integration

### Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add keys to your `.env` file:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. Configure webhooks for order confirmations

### Supported Features

- ✅ Credit card payments
- ✅ Secure checkout flow
- ✅ Order confirmation emails
- ✅ Refund processing
- ✅ Subscription support (future)

## 🔍 Search Integration

### Algolia Setup (Optional)

1. Create an [Algolia account](https://www.algolia.com/)
2. Create a search index
3. Add credentials to `.env`:
   ```env
   NEXT_PUBLIC_ALGOLIA_APPLICATION_ID=your_app_id
   NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
   ```

## 🖼️ Image Optimization

### Cloudinary Setup (Optional)

1. Create a [Cloudinary account](https://cloudinary.com/)
2. Add credentials to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## 🚀 Production Deployment

### Server Requirements

- **CPU**: 2+ cores
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB SSD minimum
- **Network**: Static IP with domain name

### Deployment Options

1. **Docker Compose** (Recommended)

   ```bash
   docker-compose up -d --build
   ```

2. **Kubernetes** (Advanced)
   - Convert docker-compose to K8s manifests
   - Use Helm charts for deployment
   - Set up ingress controllers

3. **Cloud Platforms**
   - **Vercel** (Frontend only)
   - **Railway** (Full stack)
   - **DigitalOcean** (Docker droplet)
   - **AWS ECS** (Container service)

### SSL & Domain Setup

1. Point your domain to your server
2. Set up SSL certificates (Let's Encrypt recommended)
3. Configure reverse proxy (Nginx)
4. Update environment variables with your domain

## 🔒 Security Checklist

- [ ] Change default admin credentials
- [ ] Generate strong JWT/Cookie secrets
- [ ] Configure proper CORS settings
- [ ] Enable HTTPS with valid SSL
- [ ] Secure database with strong passwords
- [ ] Set up firewall rules
- [ ] Enable automated backups
- [ ] Regular security updates
- [ ] Monitor application logs
- [ ] Set up error tracking (Sentry)

## 📊 Monitoring & Analytics

### Recommended Tools

- **Application**: New Relic, DataDog
- **Logs**: ELK Stack, Grafana
- **Errors**: Sentry, Bugsnag
- **Analytics**: Google Analytics, Mixpanel
- **Uptime**: Pingdom, UptimeRobot

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

1. 📖 Check the [Production Setup Guide](ocean-store/PRODUCTION-SETUP.md)
2. 🐛 Submit issues on [GitHub Issues](https://github.com/simplehostingserverd/shennastudiollc/issues)
3. 💬 Join our community discussions
4. 📧 Email support: support@shennasstudio.com

### Troubleshooting

- **Build Issues**: Check environment variables and dependencies
- **Database Errors**: Verify connection strings and credentials
- **Docker Problems**: Ensure Docker is running and has sufficient resources
- **Admin Access**: Reset credentials using the create-admin script

## 🌊 Ocean Conservation

**10% of all proceeds support ocean conservation efforts!**

By choosing Shenna's Studio, you're not just getting beautiful ocean-themed products – you're actively contributing to marine conservation and helping protect our oceans for future generations.

---

<div align="center">

**Made with 💙 for the Ocean**

_Crafted by the Shenna's Studio Family_

[Website](https://shennasstudio.com) • [Admin](https://admin.shennasstudio.com) • [API](https://api.shennasstudio.com)

</div>
