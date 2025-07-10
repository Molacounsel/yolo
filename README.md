# YOLO PROJECT-CREATING A BASIC CONTAINERIZED MICROSERVICE WITH MONGODB, REACT, AND DOCKER 
This project involved using containerization concepts, such as image tagging, Docker networking, image versioning, data persistence, image chaining, and Docker compose to replicate a basic e-commerce website called *Yolomy*. The backend service is runs on Node.js and uses MongoDB to enhance persistence, while the frontend service is built using React. All services can be run using Docker Compose.

## Table Of Contents
- [Goals](#goals)
- [Getting Started](#getting-started)
- [Container Setup](#container-setup)
- [Errors and Fixes](#errors-and-fixes)
- [Dockerhub Upload Summary](#dockerhub-upload-summary)
- [How to Run Locally](#how-to-run-locally)
- [Contributing](contributing)
- [License](license)

## Goals 
This project aimed to accomplish the following goals:
1. Create a frontend service using React
2. Create a backend service using Node.js, Express, and Mongoose
3. Containerize MongoDB using Docker and Docker Compose
4. Deploy backend and frontend images to Dockerhub

## Getting Started
I began by:
1. Forking and cloning the following repository to my local machine:

- Cloning with SSH

   ```bash
   git clone git@github.com:Vinge1718/yolo.git
   ```
2. Then changing to the project repository:

      ```bash
   cd yolo
   ```
## Container Setup

| Service | Base Image Chosen | Rationale | Status|
|---|---|---|---|
| mola-yolo-frontend | node:16-alpine | React app compatibility, multi-stage build optimization, and smaller final image size (131MB) |Pushed to Dockerhub|
| mola-yolo-backend | node:18-alpine| Efficient Mongo interaction, stability, data persistence suitability, and small final image size (155MB)|Pushed to Dockerhub|
| yolo-mongo | mongo:4.4 | Compatibility with system's CPU, stability, and simplicity|Running|

## Errors and Fixes
### 1. ENOENT: no such file or directory, open '/app/package.json'
![Screenshot from 2025-07-08 00-08-39](https://github.com/user-attachments/assets/6ffa6235-6af6-49de-9fdb-f988c6d25ec3)

This error means that Docker could not find the package.js when it ran *npm install*. To fix the error, I looked for the frontend source code (App.test.js, App.css, serviceWorker.js, setupTests.js), which I discovered was in the client directory. I then **moved the client directory to the frontend directory**, deleted the Dockerfile it generated, updated the frontend/Dockerfile and docker-compose.yml accordingly, and pushed the commit changes to GitHub. 

## 2. Error: error:0308010C:digital envelope routines::unsupported... code: 'ERR_OSSL_EVP_UNSUPPORTED' Node.js v18.20.8
This message relates to the OpenSSL Webpack error and is usually encountered when building React apps on newer versions of Node.js. image. To debug the error, I **downgraded the frontend image to node:16-alpine AS build**, from the initial node:18-alpine AS build. Unlike the node:18-alpine image, the older node:16-alpine image does not need OpenSSL adjustments. 

### 3. MongoDB exited with code 132, and the backend exited with code 1
![Screenshot from 2025-07-08 15-36-17](https://github.com/user-attachments/assets/c2b3e6dd-ccbe-4078-b52a-b0a6ea7a255d)

From the logs, there is a clear indication that MongoDB exited because it could not connect due to incompatibility with my system's CPU. Specifically, the log **"WARNING: MongoDB 5.0+ requires a CPU with AVX support, and your current system does not appear to have that!"** indicates that my system's CPU lacks AVX support, which MongoDB requires to connect successfully. On the other hand, the backend container exited because it could not connect to the MongoDB database, which apparently did not exist. As a result, it returned an **ECONNREFUSED** connection error and subsequently exited. To fix these errors, I **downgraded the mongo image by reverting to the older mongo:4.4**, which, unlike mongo:8.0.11, does not require AVX support. I then updated the MongoDB connection string the server.js by replacing *let mongodb_url = 'mongodb://localhost/';* with *let mongodb_url = 'mongodb://mongo:27017/';* and also updated docker-compose.yml with the correct mongo image version (mongo:4.4). I then tracked and pushed the changes to the GitHub repo. 


