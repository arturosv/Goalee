# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# The build directory will be created at /app/build
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json backend/tsconfig.json ./backend/
RUN cd backend && npm install
COPY backend/src ./backend/src
# The dist directory will be created at /app/backend/dist
RUN cd backend && npm run build

# Stage 3: Create the final production image
FROM node:18-alpine AS production
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install backend production dependencies
COPY backend/package*.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --only=production

# Copy built frontend from the builder stage
COPY --from=frontend-builder /app/build ./build

# Copy compiled backend from the builder stage
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy the database file
COPY backend/db.json ./backend/db.json

# Expose the port the app runs on.
# Render will set the PORT environment variable, and our server will use it.
# 5001 is the fallback defined in the server code.
EXPOSE 5001

# Start the server
CMD ["node", "backend/dist/server.js"] 