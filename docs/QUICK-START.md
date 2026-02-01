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
├── design-system/               # Shared design system package
├── scripts/                     # Development scripts
│   ├── setup-local.sh          # Local setup
│   └── dev.sh                  # Development
├── docker-compose.dev.yml       # Local development
└── .env.example                 # Environment template
```

## 🔧 Features Included

### 🎯 Core Features

- **Notion Integration** - Connect to Notion databases
- **OpenAI Integration** - Generate AI-powered reports
- **Authentication** - NextAuth.js with multiple providers
- **Responsive UI** - Modern design with SCSS modules
- **TypeScript** - Full type safety throughout
- **Design System** - Shared component library

### 🚀 Development Features

- **Docker** - Containerized local development
- **Hot Reload** - Instant feedback during development
- **Type Checking** - Full TypeScript support
- **Linting** - ESLint & Prettier for code quality

## 📚 Documentation

- **[README.md](../README.md)** - Project overview
- **[Local Development Guide](README-LOCAL-DEVELOPMENT.md)** - Detailed local setup

## 🎯 Use Cases

### For Developers

- **Local development** with hot reload
- **Feature development** with TypeScript
- **API testing** with built-in tools
- **Database management** with Docker

### For Teams

- **Consistent development** environment
- **Automated testing** and linting
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
