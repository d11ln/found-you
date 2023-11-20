# Specify the base image
FROM node:16-buster-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 4000

# Define the command to run the application
CMD [ "node", "dist/src/index.js" ]