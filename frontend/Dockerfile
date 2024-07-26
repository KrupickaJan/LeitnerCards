# Use a node base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Set the environment variable to bind to all network interfaces
ENV HOST 0.0.0.0

# Command to start the app
CMD ["npm", "start"]
