## Running with Docker

This project provides a ready-to-use Docker setup for local development and production builds. The Docker configuration uses Node.js version `22.13.1-slim` and exposes the application on port **3000**.

### Requirements
- Docker and Docker Compose installed
- (Optional) `.env` file in the project root for environment variables

### Build and Run

1. **(Optional)** Create a `.env` file in the project root if your application requires environment variables. Uncomment the `env_file` line in `docker-compose.yml` if you use it.

2. Build and start the application:

   ```sh
   docker compose up --build
   ```

   This will build the TypeScript project, install only production dependencies, and start the app as a non-root user.

3. The app will be available at [http://localhost:3000](http://localhost:3000).

### Ports
- **3000**: Main application port (exposed by default)

### Notes
- The Docker setup does not include external services (e.g., databases) by default. If your app requires additional services, add them to `docker-compose.yml` under `services` and update `depends_on` as needed.
- The build process uses multi-stage builds for smaller production images and caches npm dependencies for faster builds.
- The application runs as a non-root user (`appuser`) for improved security.

Refer to the Dockerfile and `docker-compose.yml` for further customization.