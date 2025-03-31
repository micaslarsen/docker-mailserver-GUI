# Docker Mailserver GUI - Docker Setup

This document provides instructions for deploying the Docker Mailserver GUI using Docker and Docker Compose.

## Prerequisites

- Docker Engine (version 19.03.0+)
- Docker Compose (version 1.27.0+)
- Running docker-mailserver container

## Directory Structure

```
docker-mailserver-GUI/
├── backend/               # Backend API
├── frontend/              # Frontend React app
├── docker/                # Docker configuration files
│   ├── nginx.conf         # Nginx configuration
│   └── start.sh           # Container startup script
├── Dockerfile             # Docker image configuration
├── docker-compose.yml     # Docker Compose configuration
└── README.docker.md       # Docker setup documentation
```

## Configuration

Before running the application, you just need to adjust the `docker-compose.yml` file to match your docker-mailserver setup:

1. Update the `DOCKER_CONTAINER` environment variable to match your docker-mailserver container name

Example:
```yaml
environment:
  - DOCKER_CONTAINER=mail-server  # Your docker-mailserver container name
```

That's it! Since we're using Docker API via the socket, no network configuration is needed. The application will communicate with docker-mailserver through the Docker daemon on the host.

## Building and Running

To build and start the application:

```bash
docker-compose up -d
```

This will:
1. Build the Docker image that includes both frontend and backend
2. Start the container in detached mode
3. Map port 80 for the web interface

## Accessing the Application

Once the container is running, you can access the web interface at:

```
http://localhost
```

## Stopping the Application

To stop the application:

```bash
docker-compose down
```

## Logs

To view logs from the container:

```bash
docker-compose logs -f mailserver-gui
```

## Updating

To update the application after making changes:

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## How It Works

The Docker setup uses a multi-stage build process:
1. First stage builds the React frontend
2. Second stage prepares the Node.js backend
3. Final stage combines both into a single image with Nginx and Docker client

When the container starts:
1. The backend Node.js server runs on port 3001 inside the container
2. Nginx serves the frontend static files
3. Nginx proxies API requests (/api/*) to the Node.js backend
4. The backend communicates with your docker-mailserver container via Docker API

The application uses Docker API directly (via the dockerode library) to:
1. Execute commands in the docker-mailserver container
2. Check the container status and resource usage
3. All operations are performed through the Docker socket (/var/run/docker.sock)

Unlike a traditional approach where containers need to be on the same network to communicate, using the Docker API through the socket means:
1. The application talks to the Docker daemon on the host
2. The Docker daemon then communicates with the docker-mailserver container
3. No direct network connection between containers is needed
4. This simplifies configuration and deployment

## Troubleshooting

### Connection to docker-mailserver fails

- Ensure the docker-mailserver container is running
- Check that the container name matches the `DOCKER_CONTAINER` environment variable
- Check that the `/var/run/docker.sock` volume is correctly mounted
- Verify that your host user has permissions to access the Docker socket

### API errors

- Check the container logs: `docker-compose logs mailserver-gui`
- Verify that the Nginx configuration correctly proxies to the backend
- Ensure the backend can start properly

### Docker API connection issues

- Check that the Docker socket is correctly mounted in the container
- Ensure your user has permissions to access the Docker socket
- Verify that the Docker client is installed in the container

## Security Considerations

- The container has access to the Docker socket, which is a security risk. Make sure to restrict access to the container.
- Consider setting up HTTPS for production deployments (you can modify the nginx.conf)
- Add authentication to the web interface for production use