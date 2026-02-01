# WorkPace Prototypes

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

## 📚 Documentation

- **[Local Development Guide](docs/README-LOCAL-DEVELOPMENT.md)** - Complete guide for running locally
- **[Quick Start Guide](docs/QUICK-START.md)** - Get up and running quickly

## 🛠️ Development Scripts

```bash
./scripts/setup-local.sh     # Initial setup
./scripts/dev.sh db:start    # Start database
./scripts/dev.sh dev         # Start dev server
./scripts/dev.sh test        # Run tests
./scripts/dev.sh lint        # Run linting
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
├── design-system/          # Shared design system package
├── scripts/                # Development scripts
├── docker-compose.dev.yml  # Local development with Docker
└── vercel.json             # Vercel deployment configuration
```

## 🔧 Features

- **Notion Integration** - Connect and sync with Notion databases
- **OpenAI Integration** - Generate reports using AI
- **Authentication** - NextAuth.js with multiple providers
- **Responsive Design** - Modern UI with SCSS modules
- **TypeScript** - Full type safety
- **Design System** - Shared component library

## 🚀 Deployment

This project deploys to **Vercel**. Pushes to the main branch are automatically deployed.

## 📖 Getting Started

For local development, see the [Local Development Guide](docs/README-LOCAL-DEVELOPMENT.md).

## 🤝 Contributing.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
