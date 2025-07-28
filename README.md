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
- [Provisioning with Ansible and Best Practices](#provisioning-with-ansible-and-best-practices)
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

Define each task in playbook.yml and test whether it is working by running:
```bash
vagrant up
  ```
After verifying that the tasks are running without errors, the next step is to create roles for similar tasks. For example, tasks involving building images can be grouped into the "image_build" role. Roles are created using ansible-galaxy. For example, to create the image_build role, you can run "ansible-galaxy init image_build." Place each task in the relevant role and delete it from the playbook.yml. In the playbook.yml, only list the roles, as shown in our case below:

<img width="335" height="237" alt="image" src="https://github.com/user-attachments/assets/e13a54ac-3732-425d-a5e0-57b66d2b69e1" />

## Provisioning with Ansible and Best Practices
In Stage 1, it is important to place the roles in blocks and define tags as good coding practice. The following image is an example of how to use blocks and tags in roles for ease of assessment and as a good coding practice. 

<img width="591" height="280" alt="image" src="https://github.com/user-attachments/assets/fc4a4256-4aea-4def-acd2-961fe165e273" />

In Stage 2, we are required to refactor the roles with variables. The variables should be defined in group_vars/all.yml. To complete Stage 2, requirements, you need to create the "Stage_Two" directory in the root directory by running:
```bash
mkdir stage_two
  ```
Then copy the necessary folders and files into stage_two to successfully orchestrate the app with Ansible:
```bash
cp -r roles/ playbook.yml group_vars/ stage_two/
  ```
The following is an example of how the roles should look after being refactored with variables. 

<img width="615" height="376" alt="image" src="https://github.com/user-attachments/assets/c6a159b2-c4db-4d11-b918-f5b638d6c1dc" />

This image shows what the group_vars/all.yml looks like:

<img width="602" height="467" alt="image" src="https://github.com/user-attachments/assets/62f6aa21-99ee-4e6a-8d8c-2781514d86e0" />

In the VM, run the following to verify that the application is running on the virtual machine successfully:
```bash
ansible-playbook playbook.yml
  ```
## Bugs and Fixes
### 1: "Error while fetching server API version: ('Connection aborted.', FileNotFoundError(2, 'No such file or directory'))"
This error means that Ansible is interfacing with Docker before Docker is up and running. To debug it, ensure Docker is active and running before Ansible connects to it. You can do so by adding the user to the Docker group during provisioning just before ansible config.vm.provision "ansible" do |ansible| in the Vagrantfile, as shown below 

<img width="584" height="183" alt="image" src="https://github.com/user-attachments/assets/d49f5b5a-31aa-4c7c-b6cb-64ab30e11bf8" />

### 2. Docker Daemon socket error (unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.45/containers/json": dial unix /var/run/docker.sock: connect: permission denied)
This error means that the vagrant user does not have access to docker.sock. To fix it, run "groups" in the VM terminal to list groups. This will list existing groups except docker. Run "sudo usermod -aG docker vagrant" to add docker group and log out. Log back in and you should see docker is you run "groups."

<img width="899" height="179" alt="Screenshot from 2025-07-27 13-54-29" src="https://github.com/user-attachments/assets/8b6bdec6-d07e-4a9f-8d62-ae80823d5c04" />

### 3. MongoDB Parameter Error

<img width="897" height="127" alt="Screenshot from 2025-07-27 14-12-53" src="https://github.com/user-attachments/assets/867c282d-5f02-4cf1-bc12-9ba71f536551" />
 This error means that MongoDB is failing because Docker network maandamano-net does not exist at the time Ansible tries to attach the container to it. To fix it, I simply added the following task before any task begins to run in the playbook.yml. This ensures that the network is created before MongoDB starts running, as shown below:

```bash
- name: Ensure maandamano-net Docker network exists
  community.docker.docker_network:
    name: maandamano-net
    state: present
  ```
### 4. "Provided hosts list is empty, only localhost is available" Error
I encountered this error when running ansible-playbook playbook.yml in stage_two's virtual environment. This indicates that Ansible could not access the inventory file, causing it to skip the tasks. To fix the error, I simply replaced the line "inventory = hosts" with "inventory = inventory.yml" inside ansible.cfg to enable Ansible to connect to the relevant host. I then copied ansible.cfg into the root directory of stage_two, as shown below.

<img width="939" height="214" alt="image" src="https://github.com/user-attachments/assets/964e6741-d6a5-46e2-9b94-795b1f94bed8" />

## How To Run Locally
1. To start VM, cd into stage_two and then run:
```bash
vagrant up
  ```
2. Then run the playbook:
```bash
cd /yolo/stage_two
ansible-playbook playbook.yml
  ```
3. You can access the frontend service on your browser by running:
```bash
http://localhost:3020
  ```
4. You can stop the service by running:
  ```bash
vagrant halt
  ```

## License
This project is licensed under the [MIT License](./LICENSE).







