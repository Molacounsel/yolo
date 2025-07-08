#Building a multi-stage Dockerfile for a Node.js application
# This Dockerfile builds a Node.js application in one stage and then copies the built application to
FROM node:16-alpine AS build

# Set the working directory in the container
WORKDIR /app

#Copy and Install application dependencies
COPY package*.json ./

RUN npm install

#Copy source code and build project
COPY . .
RUN npm run build

# Use a new stage to create the final image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

#Install a minimal static file server
RUN npm install --global serve

# Copy the built application from the previous stage
COPY --from=build /app/build/ ./build/

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["serve", "-s", "build", "-l", "3000"]





