# WorkPace Local Development

This guide shows you how to run the WorkPace app locally for development.

## ⚠️ Important: Use Only One Method at a Time

**Choose either Local Development OR Docker Container - not both simultaneously.**

Both methods use port 3000, so running both will cause conflicts.

---

## ⚡ Quick Commands (Recommended)

Add these aliases to your `~/.zshrc` file for instant setup:

```bash
# Add to ~/.zshrc (update the path to match your project location)
alias run-local='cd src && npm run start:development'
alias run-c='docker rm -f workpace-local 2>/dev/null; docker build -t workpace-local-test . && docker run -d -p 3000:3000 --name workpace-local --user root -e NODE_ENV=development -e DOCKER_CONTAINER=true -e NEXT_PUBLIC_DOCKER_CONTAINER=true workpace-local-test:latest npm run start:development --workspace src && echo "🐳 Docker container started at http://localhost:3000"'
alias stop-c='docker stop workpace-local && docker rm workpace-local && echo "🐳 Docker container stopped"'
```

**Note:** Update the path `/Users/sammy/Projects/workpace-prototypes` to match your actual project location.

**Usage:**

- `run-local` - Start local development server
- `run-c` - Start Docker container (handles everything automatically)
- `stop-c` - Stop Docker container

**After adding to ~/.zshrc, reload your shell:**

```bash
source ~/.zshrc
```

---

## 🚀 Manual Setup (Alternative)

### Option 1: Local Development (Recommended for most development)

```bash
# 1. Make sure you're using Node.js 18
nvm use 18

# 2. Install dependencies
npm install

# 3. Start the development server
cd src && npm run start:development
```

**Access your app at:** `http://localhost:3000`

**Visual indicator:** 💻 Green banner saying "Running Locally"

---

### Option 2: Docker Container

```bash
# 1. Build the Docker image
docker build -t workpace-local-test .

# 2. Clean up any existing container (if needed)
docker rm -f workpace-local

# 3. Run the container
docker run -d -p 3000:3000 --name workpace-local --user root \
  -e NODE_ENV=development \
  -e DOCKER_CONTAINER=true \
  -e NEXT_PUBLIC_DOCKER_CONTAINER=true \
  workpace-local-test:latest npm run start:development --workspace src
```

**Access your app at:** `http://localhost:3000`

**Visual indicator:** 🐳 Blue banner saying "Running in Docker Container"

---

## 🛑 Stopping the App

### Quick Commands (if using aliases)

- **Stop local development**: Press `Ctrl+C` in the terminal
- **Stop Docker container**: `stop-c`

### Manual Commands

- **Stop local development**: Press `Ctrl+C` in the terminal where the app is running
- **Stop Docker container**: `docker stop workpace-local && docker rm workpace-local`

---

## 🔧 Troubleshooting

### Port 3000 Already in Use

If you see "Port 3000 is in use", make sure you've stopped the other method first.

### Node Version Issues

Make sure you're using Node.js 18:

```bash
nvm use 18
```

### Docker Issues

**Container name already in use:**

```bash
# Remove the existing container
docker rm -f workpace-local
```

**Container won't start:**

```bash
# Remove any existing container
docker rm -f workpace-local

# Rebuild the image
docker build -t workpace-local-test .
```

**Check what's running:**

```bash
# See all containers
docker ps -a

# See running containers
docker ps
```

---

## 🎯 Visual Indicators

- **💻 Green Banner** = Running locally on your machine
- **🐳 Blue Banner** = Running in Docker container
- **No Banner** = Production build

This helps you know which environment you're working in!
