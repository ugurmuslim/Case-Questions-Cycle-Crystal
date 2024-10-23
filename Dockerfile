# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Install type definitions as dev dependencies, excluding @types/sequelize-typescript
RUN npm install --save-dev @types/node @types/express @types/sequelize @types/cors @types/node-cron @types/faker

# Copy the rest of the application code
COPY .. .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
