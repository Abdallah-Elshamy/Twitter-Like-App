# Use NodeJS base image
FROM node:16.0.0
# Create app directory in Docker
WORKDIR /usr/src/app
# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./
# Install dependencies in Docker
RUN npm install
# Copy app from local environment into the Docker image
COPY . .
# Set the API’s port number
EXPOSE 8000
# Transpile from TypeScript to JavaScript
RUN npm run build
# Define Docker’s behavior when the image is run
CMD ["node", "./dist/app.js"]