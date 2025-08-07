FROM node:20-alpine
WORKDIR /app

# Copy package manifest(s)
COPY package.json package-lock.json* ./

# Use npm ci if a lockfile exists, otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi

# Copy the rest
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
