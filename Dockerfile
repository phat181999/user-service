# Use full Node.js (not Alpine) to avoid missing modules like crypto
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build project
RUN npm run build

# Expose port
EXPOSE 8080

# Start app using the proper npm run syntax
CMD ["npm", "run", "start:prod"]
