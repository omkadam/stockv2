# Use the official Node.js image as the base image
FROM node:latest

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the Node.js application
CMD ["node", "rapid.js"] 
