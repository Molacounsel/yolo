# I_P 2: YOLO PROJECT: REPLICATING A BASIC MICROSERVICE USING MONGODB, REACT, AND DOCKER 
This project involved using containerization concepts, such as image tagging, Docker networking, multi-stage builds, image versioning, data persistence, command chaining, and Docker compose to replicate a basic e-commerce website called *Yolomy*. The backend service runs on Node.js and uses MongoDB to enhance persistence, while the frontend service is built using React. All services can be run using Docker Compose.

## Table Of Contents
- [Goals](#goals)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Container Setup](#container-setup)
- [Bugs and Fixes](#bugs-and-fixes)
- [Dockerhub Upload](#dockerhub-upload)
- [How to Run Locally](#how-to-run-locally)
- [License](license)

## Goals 
This project aimed to accomplish the following goals:
1. Create a frontend service using React
2. Create a backend service using Node.js, Express, and Mongoose
3. Containerize MongoDB using Docker and Docker Compose
4. Deploy backend and frontend images to Dockerhub

## Prerequisites
The following are the requirements to successfuly run the application:
1. [Node.js](https://nodejs.org/en/download)
2. [Docker](https://docs.docker.com/engine/install/)
3. Docker Compose
4. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
   
   
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

## Bugs and Fixes
### 1. ENOENT: no such file or directory, open '/app/package.json'
![Screenshot from 2025-07-08 00-08-39](https://github.com/user-attachments/assets/6ffa6235-6af6-49de-9fdb-f988c6d25ec3)

This error means that Docker could not find the package.js when it ran *npm install*. To fix the error, I looked for the frontend source code (App.test.js, App.css, serviceWorker.js, setupTests.js), which I discovered was in the client directory. I then **moved the client directory to the frontend directory**, deleted the Dockerfile it generated, updated the frontend/Dockerfile and docker-compose.yml accordingly, and pushed the commit changes to GitHub. 

## 2. Error: error:0308010C:digital envelope routines::unsupported... code: 'ERR_OSSL_EVP_UNSUPPORTED' Node.js v18.20.8
This message relates to the OpenSSL Webpack error and is usually encountered when building React apps on newer versions of Node.js. image. To debug the error, I **downgraded the frontend image to node:16-alpine AS build**, from the initial node:18-alpine AS build. Unlike the node:18-alpine image, the older node:16-alpine image does not need OpenSSL adjustments. 

### 3. MongoDB exited with code 132, and the backend exited with code 1
![Screenshot from 2025-07-08 15-36-17](https://github.com/user-attachments/assets/c2b3e6dd-ccbe-4078-b52a-b0a6ea7a255d)

From the logs, there is a clear indication that MongoDB exited because it could not connect due to incompatibility with my system's CPU. Specifically, the log **"WARNING: MongoDB 5.0+ requires a CPU with AVX support, and your current system does not appear to have that!"** indicates that my system's CPU lacks AVX support, which MongoDB requires to connect successfully. On the other hand, the backend container exited because it could not connect to the MongoDB database, which apparently did not exist. As a result, it returned an **ECONNREFUSED** connection error and subsequently exited. To fix these errors, I **reverted to the older mongo:4.4**, which, unlike mongo:8.0.11, does not require AVX support. I then updated the MongoDB connection string the server.js by replacing *let mongodb_url = 'mongodb://localhost/';* with *let mongodb_url = 'mongodb://mongo:27017/';* (as shown in the image below) and also updated docker-compose.yml with the correct mongo image version (mongo:4.4). I then tracked and pushed the changes to the GitHub repo. 
<img width="730" height="95" alt="Screenshot from 2025-07-08 16-31-46" src="https://github.com/user-attachments/assets/17704bda-a28d-473f-b751-9067f0689f97" />

### 4. Mongoose Validation Error: *Price: Cast to Number failed for value 'Ksh. 2,000'*
I encountered this error when I tried to check data persistence by adding a product to the website on the UI. The error occurred because Mongoose could not interpret Ksh. 2,000 as a valid number, since it expected a purely numeric value (e.g., 2000). To debug the error, I cleaned input in the router.post section of productRoute.js by adding the following:
```bash
router.post('/', (req, res) => {
    // Clean the price input
    const rawPrice = req.body.price;
    const cleanedPrice = parseFloat(
        String(rawPrice).replace(/[^0-9.]/g, '')
  ```

## DockerHub Upload 
### 1. counselmola/yolo-frontend image
<img width="1011" height="252" alt="image" src="https://github.com/user-attachments/assets/f21271d2-545a-4fdf-85d4-93c295293481" />

### 2. counselmola/yolo-backend image
<img width="1011" height="252" alt="image" src="https://github.com/user-attachments/assets/b9b76622-7cf8-47ce-bb85-b7ad6baf0843" />

## How to Run Locally
To run the app locally on your machine, run the following commands:
```bash
git clone https://github.com/Molacounsel/yolo
cd yolo
docker compose build
docker compose up
```
Then access the website by running the following on your web browser:
```bash
http://localhost:3000
```
Run the following command to stop the app:
```bash
docker compose down
```

## License
This project is licensed under the [MIT License](./LICENSE).


# I_P 3: CONFIGURATION MANAGEMENT USING VAGRANT, ANSIBLE, AND TERRAFORM
The goal of this third IP was to automate the deployment of an e-commerce website across different virtual machines using Ansible, Vagrant, and Docker. The project is divided into two stages: 1) Ansible Instrumentation, and 2) Ansible (and Terraform-Optional) Instrumentation. However, for the purposes of this IP, I only used Ansible to orchestrate the virtual machine and fire up the Yolomy e-commerce app we were working with in IP 2. 

## Table Of Contents
- [Prerequisites](#prerequisites)
- [Setting Up Virtual Machine](#setting-up-virtual-machine)
- [Creating Ansible Playbook](#creating-ansible-playbook)
- [Defining Roles in Ansible Playbook](#defining-roles-in-ansible-playbook)
- [Provisioning with Ansible](#provisioning-with-ansible)
- [Bugs and Fixes](#bugs-and-fixes)
- [How To Run Locally](#how-to-run-locally)
- [License](license)

  ## Prerequisites
  To successfully provision, configure, and manage the application, you need to have the following installed on your machine:
   1. [Virtual Box](www.virtualbox.org)
   2. [Docker](https://docs.docker.com/engine/install/)
   3. [Vagrant](https://developer.hashicorp.com/vagrant/docs/installation)
   4. [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/index.html)
   5. [VS Code](https://code.visualstudio.com/download)

  ## Setting Up Virtual Machine
  To create a virtual environment, we need to have a VirtualBox image. For this project, I used this [VirtualBox Image](https://portal.cloud.hashicorp.com/vagrant/discover/geerlingguy/ubuntu2004) recommended in our project instructions. To do so, I ran the following command on a directory on my local machine:
```bash
vagrant init geerlingguy/ubuntu2004 --box-version 1.0.4
  ```
This creates a Vagrantfile inside the directory. Open the directory with VS Code and click on the Vagrantfile. Replace the contents with the following:
```bash
Vagrant.configure("2") do |config|
  config.vm.box = "geerlingguy/ubuntu2004"
  config.vm.box_version = "1.0.4"
end
  ```
To get into the created Virtual Machine, run: 
```bash
vagrant ssh
  ```
To exit the VM, simply run "exit" in the terminal. 

You can also run the following command to stop the VM:
```bash
vagrant halt
  ```

## Creating Ansible Playbook
In the root directory, create a playbook.yml file by running the following command in the terminal:
```bash
touch playbook.yml
  ```
You can then populate the playbook by specifying the hosts that Ansible should target, the script that is going to be executed by the root user, and the tasks to be run, as shown in this image: 

<img width="351" height="74" alt="image" src="https://github.com/user-attachments/assets/a98a5031-9ebb-4050-8f90-c8511cf2453b" />
