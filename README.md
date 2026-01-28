# WorkPace Prototypes Test

A Next.js application for managing work accomplishments and generating reports using Notion and OpenAI integration.

## 🚀 Quick Start

### Local Development

1. **Clone and setup:**

   ```bash
   git clone <repository-url>
   cd workpace-prototypes
   ./scripts/setup-local.sh
   ```

2. **Start development:**

   ```bash
   ./scripts/dev.sh db:start  # Start database
   ./scripts/dev.sh dev       # Start development server
   ```

3. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Production Deployment

For Kubernetes deployment to Digital Ocean:

```bash
./scripts/setup-k8s.sh
```

## 📚 Documentation

- **[Local Development Guide](README-LOCAL-DEVELOPMENT.md)** - Complete guide for running locally
- **[Kubernetes Deployment Guide](README-DEPLOYMENT.md)** - Production deployment instructions

## 🛠️ Development Scripts

### Local Development

```bash
./scripts/setup-local.sh     # Initial setup
./scripts/dev.sh db:start    # Start database
./scripts/dev.sh dev         # Start dev server
./scripts/dev.sh test        # Run tests
./scripts/dev.sh lint        # Run linting
```

### Production Deployment

```bash
./scripts/setup-k8s.sh       # Complete Kubernetes setup
./scripts/deploy.sh deploy   # Deploy application
./scripts/deploy.sh status   # Check status
./scripts/deploy.sh logs     # View logs
```

## 🏗️ Project Structure

```
workpace-prototypes/
├── src/                     # Source code
│   ├── api/                # API routes
│   ├── components/         # Reusable components
│   ├── modules/            # Feature modules
│   ├── pages/              # Next.js pages
│   └── ...
├── k8s/                    # Kubernetes manifests
├── scripts/                # Development & deployment scripts
├── docker-compose.dev.yml  # Local development with Docker
└── Dockerfile              # Production container
```

## 🔧 Features

- **Notion Integration** - Connect and sync with Notion databases
- **OpenAI Integration** - Generate reports using AI
- **Authentication** - NextAuth.js with multiple providers
- **Responsive Design** - Modern UI with SCSS modules
- **TypeScript** - Full type safety
- **Kubernetes Ready** - Production deployment with monitoring

## 🚀 Deployment

### Local Development

- Node.js 22+
- PostgreSQL (or Docker)
- Environment variables in `.env.local`

### Production

- Kubernetes cluster
- Digital Ocean Container Registry
- SSL certificates with cert-manager
- Monitoring with Prometheus & Grafana

## 📖 Getting Started

1. **For local development:** See [Local Development Guide](README-LOCAL-DEVELOPMENT.md)
2. **For production deployment:** See [Kubernetes Deployment Guide](README-DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
