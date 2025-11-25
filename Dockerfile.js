# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all source files
COPY . .

# Expose backend port (should match process.env.PORT)
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
