# Docker Mailserver GUI

A graphical user interface for managing Docker Mailserver. The application allows easy management of email accounts, aliases, and monitoring of server status.

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

## Docker

You can run the entire application using Docker Compose in a single container. This setup integrates with your existing docker-mailserver container:

```bash
# Build and start the container
docker-compose up -d
```

The application will be available at http://localhost

Key features of the Docker setup:
- Single container with both frontend and backend
- Nginx serves the React frontend and proxies API requests 
- Communication with docker-mailserver via Docker API
- No need for shared networks between containers
- Only the Docker socket needs to be mounted
- Minimal configuration (just set the container name)

For detailed Docker setup instructions, please refer to [README.docker.md](README.docker.md).

## License

MIT