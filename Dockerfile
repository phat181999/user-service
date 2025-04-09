# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install any needed packages
RUN npm install -g @nestjs/cli
RUN npm install --force

# Copy the rest of the application code
COPY . .
RUN npm run build
# Expose the port the app runs on
EXPOSE 8080

# Run the application
CMD ["npm", "start:prod"]
