# WorkPace Quick Start Guide

Get up and running with WorkPace in minutes!

## 🚀 Super Quick Start (2 minutes)

```bash
# 1. Clone and setup
git clone <repository-url>
cd workpace-prototypes
./scripts/setup-local.sh

# 2. Start development
./scripts/dev.sh db:start  # Start database
./scripts/dev.sh dev       # Start app

# 3. Open browser
open http://localhost:3000
```

## 📋 What You Get

### ✅ Complete Local Development Environment

- **Next.js 14** with TypeScript
- **PostgreSQL** database with Docker
- **Redis** for caching (optional)
- **Hot reload** development server
- **ESLint & Prettier** for code quality
- **VS Code** configuration

### ✅ Production-Ready Kubernetes Deployment

- **Multi-stage Docker** builds
- **Kubernetes manifests** for all components
- **GitHub Actions** CI/CD pipeline
- **SSL certificates** with Let's Encrypt
- **Monitoring** with Prometheus & Grafana
- **Health checks** and resource management

## 🛠️ Available Scripts

### Local Development

```bash
./scripts/setup-local.sh          # Initial setup
./scripts/dev.sh db:start         # Start database
./scripts/dev.sh dev              # Start dev server
./scripts/dev.sh test             # Run tests
./scripts/dev.sh lint             # Run linting
./scripts/test-local-setup.sh     # Test your setup
```

### Production Deployment

```bash
./scripts/setup-k8s.sh            # Complete K8s setup
./scripts/deploy.sh deploy        # Deploy app
./scripts/deploy.sh status        # Check status
./scripts/deploy.sh logs          # View logs
./scripts/deploy.sh monitoring    # Deploy monitoring
```

## 📁 Project Structure

```
workpace-prototypes/
├── src/                          # Source code
│   ├── api/                     # API routes
│   ├── components/              # Reusable components
│   ├── modules/                 # Feature modules
│   │   ├── AccomplishmentReport/
│   │   └── WorkpacePrototypes/
│   ├── pages/                   # Next.js pages
│   └── ...
├── k8s/                         # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── monitoring/
├── scripts/                     # All scripts
│   ├── setup-local.sh          # Local setup
│   ├── dev.sh                  # Development
│   ├── setup-k8s.sh            # K8s setup
│   └── deploy.sh               # Deployment
├── docker-compose.dev.yml       # Local development
├── Dockerfile                   # Production container
└── .env.example                 # Environment template
```

## 🔧 Features Included

### 🎯 Core Features

- **Notion Integration** - Connect to Notion databases
- **OpenAI Integration** - Generate AI-powered reports
- **Authentication** - NextAuth.js with multiple providers
- **Responsive UI** - Modern design with SCSS modules
- **TypeScript** - Full type safety throughout

### 🚀 DevOps Features

- **Docker** - Containerized development and production
- **Kubernetes** - Production deployment with auto-scaling
- **CI/CD** - Automated testing and deployment
- **Monitoring** - Prometheus, Grafana, and health checks
- **SSL/TLS** - Automatic certificate management
- **Database** - PostgreSQL with connection pooling

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[Local Development Guide](README-LOCAL-DEVELOPMENT.md)** - Detailed local setup
- **[Kubernetes Deployment Guide](README-DEPLOYMENT.md)** - Production deployment

## 🎯 Use Cases

### For Developers

- **Local development** with hot reload
- **Feature development** with TypeScript
- **API testing** with built-in tools
- **Database management** with Docker

### For DevOps

- **Kubernetes deployment** with monitoring
- **CI/CD pipeline** with GitHub Actions
- **SSL certificate** management
- **Scaling and load balancing**

### For Teams

- **Consistent development** environment
- **Automated testing** and deployment
- **Monitoring and alerting**
- **Documentation and guides**

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database connection issues:**

   ```bash
   ./scripts/dev.sh db:restart
   ```

3. **Dependencies issues:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Test your setup:**
   ```bash
   ./scripts/test-local-setup.sh
   ```

## 🎉 Success!

Once everything is running, you'll have:

- ✅ **Local development server** at http://localhost:3000
- ✅ **Database** running in Docker
- ✅ **Hot reload** for instant development
- ✅ **TypeScript** type checking
- ✅ **ESLint** code quality
- ✅ **Production-ready** Kubernetes deployment

## 🚀 Next Steps

1. **Update environment variables** in `.env.local`
2. **Connect your Notion database**
3. **Add your OpenAI API key**
4. **Start building features!**

## 📞 Need Help?

- Check the detailed guides in the `README-*.md` files
- Run `./scripts/test-local-setup.sh` to diagnose issues
- Review the troubleshooting section above

Happy coding! 🎉
