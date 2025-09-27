# WorkPace Local Development Guide

This guide covers setting up and running the WorkPace application locally for development purposes.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

### Required Software

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package managers (npm comes with Node.js)
- **Git** - Version control
- **Docker** (optional) - For containerized development
- **Docker Compose** (optional) - For multi-container setups

### Recommended Tools

- **VS Code** - Code editor with excellent TypeScript support
- **cURL** - API testing
- **Chrome DevTools** - Browser debugging

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd workpace-prototypes
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/workpace_dev"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Notion API
NOTION_API_KEY="your-notion-api-key"
NOTION_DATABASE_ID="your-database-id"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# Other environment variables
NODE_ENV="development"
```

### 4. Start the Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Detailed Setup

### Database Setup

#### Option 1: Local PostgreSQL

1. **Install PostgreSQL:**

   ```bash
   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database:**

   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database and user
   CREATE DATABASE workpace_dev;
   CREATE USER workpace_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE workpace_dev TO workpace_user;
   \q
   ```

3. **Update DATABASE_URL:**
   ```env
   DATABASE_URL="postgresql://workpace_user:your_password@localhost:5432/workpace_dev"
   ```

#### Option 2: Docker PostgreSQL

1. **Create docker-compose.yml:**

   ```yaml
   version: "3.8"
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: workpace_dev
         POSTGRES_USER: workpace_user
         POSTGRES_PASSWORD: your_password
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

2. **Start PostgreSQL:**

   ```bash
   docker-compose up -d postgres
   ```

3. **Update DATABASE_URL:**
   ```env
   DATABASE_URL="postgresql://workpace_user:your_password@localhost:5432/workpace_dev"
   ```

### API Keys Setup

#### Notion API

1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the API key to your `.env.local`
4. Share your Notion databases with the integration

#### OpenAI API

1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to your `.env.local`

### NextAuth.js Setup

1. **Generate a secret:**

   ```bash
   openssl rand -base64 32
   ```

2. **Add to .env.local:**
   ```env
   NEXTAUTH_SECRET="your-generated-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Development Commands

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database
```

### Docker Development

#### Build and Run with Docker

```bash
# Build the Docker image
docker build -t workpace-app .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  workpace-app
```

#### Docker Compose Development

Create a `docker-compose.dev.yml`:

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://workpace_user:your_password@postgres:5432/workpace_dev
      - NEXTAUTH_SECRET=your-secret
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: workpace_dev
      POSTGRES_USER: workpace_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with Docker Compose:

```bash
docker-compose -f docker-compose.dev.yml up
```

## Project Structure

```
workpace-prototypes/
├── src/
│   ├── api/                 # API routes
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── interfaces/         # TypeScript interfaces
│   ├── layout/             # Layout components
│   ├── modules/            # Feature modules
│   ├── pages/              # Next.js pages
│   ├── server/             # Server-side utilities
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions
├── k8s/                    # Kubernetes manifests
├── scripts/                # Deployment scripts
├── public/                 # Static assets
├── .github/                # GitHub Actions workflows
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
└── package.json            # Dependencies and scripts
```

## Development Workflow

### 1. Feature Development

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**

   - Write code following the existing patterns
   - Add TypeScript types for new interfaces
   - Update components in the appropriate modules

3. **Test your changes:**

   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### 2. Component Development

The project uses a modular architecture with the following structure:

```
src/modules/YourModule/
├── components/          # Module-specific components
├── entries/            # Main module pages/views
├── features/           # Reusable features
├── hooks/              # Module-specific hooks
├── widgets/            # Complex UI widgets
└── index.ts            # Module exports
```

### 3. API Development

API routes are located in `src/pages/api/` and follow Next.js conventions:

```
src/pages/api/
├── auth/               # Authentication endpoints
├── notion/             # Notion API integration
└── openai/             # OpenAI API integration
```

## Debugging

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Browser DevTools

- **React DevTools**: Install the React Developer Tools browser extension
- **Next.js DevTools**: Built-in development tools available in the browser
- **Network Tab**: Monitor API calls and responses

### Logging

The application uses structured logging:

```typescript
// Server-side logging
console.log("API Request:", { method, url, body });

// Client-side logging
console.log("Component rendered:", { props, state });
```

## Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### API Testing

Use Postman or create test files:

```typescript
// tests/api/auth.test.ts
import { createMocks } from "node-mocks-http";
import handler from "../../src/pages/api/auth/[...nextauth]";

describe("/api/auth", () => {
  it("should handle authentication", async () => {
    const { req, res } = createMocks({
      method: "GET",
      url: "/api/auth/signin",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
```

## Performance Optimization

### Development Performance

1. **Use React DevTools Profiler** to identify performance bottlenecks
2. **Enable Next.js Analytics** in development:

   ```javascript
   // next.config.js
   module.exports = {
     experimental: {
       analyticsId: "your-analytics-id",
     },
   };
   ```

3. **Monitor Bundle Size:**
   ```bash
   npm run build
   # Check the build output for bundle analysis
   ```

### Database Performance

1. **Use database indexes** for frequently queried fields
2. **Implement connection pooling** for database connections
3. **Use database query logging** in development

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

#### 2. Database Connection Issues

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql
```

#### 3. Environment Variables Not Loading

- Ensure `.env.local` is in the root directory
- Restart the development server after changing environment variables
- Check for typos in variable names

#### 4. TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next
npm run type-check
```

#### 5. Module Resolution Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

1. **Check the logs** in the terminal where you ran `npm run dev`
2. **Check browser console** for client-side errors
3. **Review the documentation** for the specific libraries you're using
4. **Search existing issues** in the repository
5. **Create a new issue** with detailed error information

## Best Practices

### Code Quality

1. **Follow TypeScript strict mode** - Enable all strict type checking options
2. **Use ESLint and Prettier** - Maintain consistent code style
3. **Write meaningful commit messages** - Follow conventional commit format
4. **Add JSDoc comments** for complex functions
5. **Use meaningful variable and function names**

### Security

1. **Never commit secrets** - Use `.env.local` for sensitive data
2. **Validate all inputs** - Sanitize user inputs
3. **Use HTTPS in production** - Always use secure connections
4. **Implement proper authentication** - Use NextAuth.js for auth flows

### Performance

1. **Optimize images** - Use Next.js Image component
2. **Implement code splitting** - Use dynamic imports for large components
3. **Use React.memo** for expensive components
4. **Implement proper caching** - Use Next.js caching strategies

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Notion API Documentation](https://developers.notion.com)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests for new functionality**
5. **Ensure all tests pass**
6. **Submit a pull request**

For more information, see the main [README.md](README.md) file.
