FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Set production environment by default
ENV NODE_ENV=production

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

# Copy and make startup scripts executable
COPY startup.sh startup-simple.sh /app/
RUN chmod +x /app/startup.sh /app/startup-simple.sh

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

# Expose ports
EXPOSE 9000 7001

# Use startup script (can be overridden with STARTUP_MODE=simple)
CMD ["sh", "-c", "if [ \"$STARTUP_MODE\" = \"simple\" ]; then exec /app/startup-simple.sh; else exec /app/startup.sh; fi"]