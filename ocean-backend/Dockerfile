FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for building)
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies after build
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy and make startup script executable
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

# Expose ports
EXPOSE 9000 7001

# Use startup script
CMD ["/app/startup.sh"]