# Docker Mailserver GUI
[![Docker Pulls](https://img.shields.io/docker/pulls/dunajdev/docker-mailserver-gui)](https://hub.docker.com/r/dunajdev/docker-mailserver-gui)

A graphical user interface for managing [Docker Mailserver](https://github.com/docker-mailserver/docker-mailserver). The application allows easy management of email accounts, aliases, and monitoring of server status.

## Features

- 📊 Dashboard with server status information
- 👤 Email account management (add, delete)
- ↔️ Email alias management
- 🔧 Docker Mailserver connection configuration
- 🌐 Multilingual support (English, Polish)

## Requirements

- Node.js (v16+)
- npm
- Docker Mailserver (installed and configured)

## Project Structure

The application consists of two parts:

- **Backend**: Node.js/Express API for communicating with Docker Mailserver
- **Frontend**: React user interface with i18n support

## Installation

### Backend

```bash
cd backend
npm install
```

Configure the `.env` file with the appropriate environment variables:

```
PORT=3001
SETUP_SCRIPT=/path/to/docker-mailserver/setup.sh
```

### Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm start
```

After running both parts, the application will be available at http://localhost:3000

## Configuration

After the first launch, go to the "Settings" tab and configure:

1. Path to the `setup.sh` script from Docker Mailserver
2. Docker Mailserver container name

## Language Support

The application supports multiple languages:

- English
- Polish

Languages can be switched using the language selector in the top navigation bar.

## Docker Deployment

There are two ways to deploy using Docker:

### Option 1: Using the pre-built image from Docker Hub (Recommended)

```bash
docker run -d \
  --name mailserver-gui \
  -p 80:80 \
  -e DOCKER_CONTAINER=mailserver \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  dunajdev/docker-mailserver-gui:latest
```

**Note:** Replace `mailserver` with the name of your docker-mailserver container.

### Option 2: Building locally with Docker Compose

```bash
# Build and start the container
docker-compose up -d
```

The application will be available at http://localhost

### Environment Variables

- `DOCKER_CONTAINER`: Name of your docker-mailserver container (required)
- `PORT`: Internal port for the Node.js server (defaults to 3001)
- `NODE_ENV`: Node.js environment (defaults to production)

### Docker Features

- Single container with both frontend and backend
- Nginx serves the React frontend and proxies API requests 
- Communication with docker-mailserver via Docker API
- No need for shared networks between containers
- Only the Docker socket needs to be mounted
- Minimal configuration (just set the container name)

For detailed Docker setup instructions, please refer to:
- [README.docker.md](README.docker.md) - Detailed Docker setup guide
- [README.dockerhub.md](README.dockerhub.md) - Docker Hub specific information

## Code Formatting

This project uses [Prettier](https://prettier.io/) for consistent code formatting. Configuration is defined in the root `.prettierrc.json` file.

### Automatic Formatting

Formatting is automatically applied to staged files before each commit using [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged). This ensures that all committed code adheres to the defined style guide.

### Manual Formatting

You can also manually format the code using the npm scripts available in both the `backend` and `frontend` directories:

```bash
# Navigate to the respective directory (backend or frontend)
cd backend # or cd frontend

# Format all relevant files
npm run format

# Check if all relevant files are formatted correctly
npm run format:check
```

## License

MIT
