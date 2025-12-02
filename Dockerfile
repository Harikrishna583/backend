# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose backend port (Coolify will map automatically)
EXPOSE 5000

# Add curl for healthcheck (alpine does not have curl)
RUN apk add --no-cache curl

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD curl -f http://localhost:5000/health || exit 1

# Start server
CMD ["node", "server.js"]
