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
- [Requirements](#requirements)
- [Setting Up Virtual Machine](#setting-up-virtual-machine)
- [Creating Ansible Playbook](#creating-ansible-playbook)
- [Provisioning with Ansible and Best Practices](#provisioning-with-ansible-and-best-practices)
- [Errors and Fixes](#errors-and-fixes)
- [Run Locally](#run-locally)
- [License](license)

  ## Requirements
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

In Stage 2, we are required to refactor the roles with variables. The variables should be defined in group_vars/all.yml. To complete Stage 2, requirements, you need to create the "Stage_two" directory in the root directory by running:
```bash
mkdir Stage_two
  ```
Then copy the necessary folders and files into stage_two to successfully orchestrate the app with Ansible:
```bash
cp -r roles/ Vagrantfile playbook.yml group_vars/ Stage_two/
  ```
The following is an example of how the roles should look after being refactored with variables. 

<img width="615" height="376" alt="image" src="https://github.com/user-attachments/assets/c6a159b2-c4db-4d11-b918-f5b638d6c1dc" />

This image shows what the group_vars/all.yml looks like:

<img width="602" height="467" alt="image" src="https://github.com/user-attachments/assets/62f6aa21-99ee-4e6a-8d8c-2781514d86e0" />

In the VM, run the following to verify that the application is running on the virtual machine successfully:
```bash
ansible-playbook playbook.yml
  ```
## Errors and Fixes
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

## Run Locally
1. To run locally on your machine:

```bash
git clone -b Stage_two https://github.com/Molacounsel/yolo.git && \
cd yolo/Stage_two && \
vagrant up && \
ansible-playbook playbook.yml
```
4. You can access the frontend service on your browser by running:
```bash
http://localhost:3020
  ```
5. You can stop the service by running:
  ```bash
vagrant halt
  ```

## License
This project is licensed under the [MIT License](./LICENSE).


# I_P 4: ORCHESTRATION WITH KUBERNETES
This project involves applying orchestration concepts to build and deploy a full-stack e-commerce application on Google Kubernetes Engine (GKE). Among the concepts implemented include the use of StatefulSets, headless services, and Persistent Volume Claims for data persistent storage solutions, Docker Image Tags, Containerization, and Multi-service Architecture. 

## Table Of Contents
- [Required](#required)
- [Set Up Manifests](#setting-up-manifests)
- [Configure Kubernetes Cluster](#configure-kubernetes-cluster)
- [Deploy the Manifests](#deploy-the-manifests)
- [Bugs and Debugs](#bugs-and-debugs)
- [App Access](#app-access)
- [Justifications and Final Thoughts](#justifications and final-thoughts)

## Required
In order to successfully run this application, you need the following prerequisites:
1. [Google Cloud Account](https://myaccount.google.com/?pli=1)
2. [Google Kubernetes Engine (GKE) Cluster](https://www.youtube.com/watch?v=hxpGC19PzwI)
3. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
4. [Docker](https://docs.docker.com/engine/install/)
5. [Kubernetes Manifests](https://kubernetes.io/docs/concepts/overview/working-with-objects/)

## Set Up Manifests
On the repository root, create a directory/folder called "manifests." This folder should house all the manifest (yaml) files required for successful Kubernetes deployment and launching of the application. These yaml files include:
1. backend-deployment.yaml for deploying the Node.js backend container
2. backend-service.yaml for communication between frontend pods and backend
3. frontend-deployment.yaml for deploying frontend container
4. frontend-service.yaml for exposing frontend to external users through the External IP address
5. mongo-statefulset.yaml for persistent data storage
6. mongo-service.yaml for exposing MongoDB to backend pods

### Note: Each of these files should be created inside the manifests directory. To do so, for example:

```bash
cd manifests && touch frontend-deployment.yaml
```
Below is a screenshot of my manifests directory and its yaml files.

<img width="250" height="173" alt="image" src="https://github.com/user-attachments/assets/53da3b83-3b7c-48cf-a3b5-3037a337c170" />

## Configure Kubernetes Cluster
To deploy our app on GKE platform, we need to create a project and a cluster inside the project. You can use this guide to create a [Google Cloud Project and Cluster](https://cloud.google.com/kubernetes-engine/docs/deploy-app-cluster). 

The following are details of my GKE Project and Cluster:
### Project
<img width="436" height="157" alt="image" src="https://github.com/user-attachments/assets/89ef770c-8005-43ba-8e53-edeea41ccc33" />

### Cluster
<img width="1013" height="147" alt="image" src="https://github.com/user-attachments/assets/91679c5b-e4f4-4997-8755-e5da483a49e5" />

After successfully creating the cluster, configure Google Cloud CLI on your local machine (e.g., VS Code terminal) by running the following commands:

```bash
gcloud auth login && gcloud config set project YOUR_PROJECT_ID
```
In my case, that would be:

```bash
gcloud auth login && gcloud config set project yolo-project-468421
```
Then run the following command to configure the cluster credentials:

Watch out for a message like this:

<img width="1273" height="522" alt="Screenshot from 2025-08-09 09-23-59" src="https://github.com/user-attachments/assets/cd42d135-96da-4045-bdf6-5e4c5719992c" />

Next, run the following command to connect to the cluster named "yolo-cluster." 

```bash
gcloud container clusters get-credentials yolo-cluster --zone us-central1-c
```
You should ensure that you have kubectl installed and that cluster access is configured on your machine. You can follow this official guide to achieve that:

```bash
https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#apt_1
```
Once that is done, verify that kubectl is working by running

```bash
kubectl get pods
```
If it runs successfully, then you are ready to deploy your manifests. 

## Deploy the Manifests
After verifying that kubectl is correctly configured, populate the cluster with the application and deploy the manifests by running the following command:
```bash
kubectl apply -f manifests/
```
This should indicate that the deployments have been created.

Run the following command to get details about the pods, such as status, age, ports, and IP address: 

```bash
kubectl get pods
```
This should return a message like this:

<img width="1006" height="233" alt="Screenshot from 2025-08-09 12-08-32" src="https://github.com/user-attachments/assets/08e41e89-f665-4f06-986a-0edab23e3da1" />

This means that the app is successfully running and can be accessed via the displayed frontend external IP address in the browser. 

## Bugs and Debugs
### 1. GKE Auth Plugin Warning

<img width="999" height="133" alt="Screenshot from 2025-08-09 09-38-24" src="https://github.com/user-attachments/assets/2ba3bb29-cd6e-4317-845a-b83e5c720dab" />

This error basically means that my machine does not have the gke-gcloud-auth-plugin, which is required to run the "kubectl" command. In short, without the plugin, I would not be able to run critical commands like "kubectl get pods," "kubectl apply -f manifests/," and "kubectl get service." 

To fix it, I simply installed the plugin by following this [official guide](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin). NOTE, howver, that I had to go with the external package manager "apt" to have it successfully installed, as shown in the screenshot below.

<img width="769" height="276" alt="image" src="https://github.com/user-attachments/assets/821ef96e-3dce-4bf4-a635-0da3bb544196" />

### 2. Backend Pods Crashing

<img width="990" height="247" alt="Screenshot from 2025-08-09 10-28-40" src="https://github.com/user-attachments/assets/47e4e305-0a87-4537-adff-118c2966251a" />

This means that my backend pods were repeatedly crashing and were not able to run successfully. After thoroughly inspecting the logs and the backend-deployment.yaml, I noticed that I had not defined the environment variables, so the backend could not connect to mongo-service. 

To fix it, I simply added the following environment variables:

```bash
env:
  - name: MONGODB_URI
    value: mongodb://mongo-service.default.svc.cluster.local:27017/yolodb
```
<img width="1121" height="522" alt="image" src="https://github.com/user-attachments/assets/1e08cc94-1ab4-41a0-9a6e-8b05538c0b12" />

Note that I had to ensure that the environment variable name in my backend-deployment.yaml (MONGODB_URI) matches the one in the server.js, otherwise the backend pods would still crash.

After updating the backend environment variables, I simply re-applied the backend deployment by runnin the following command:

```bash
env:
 kubectl apply -f backend-deployment.yaml
```
I then ran "kubectl get pods" to verify that all the pods are running. Finally, I ran "kubectl get svc" to obtain the frontend service external IP to confirm that the app is successfully running on the browser.

<img width="1193" height="295" alt="image" src="https://github.com/user-attachments/assets/43f3ee54-9ae6-4786-8322-b73cb1e9dd40" />

## App Access
The app is deployed on GKE and can be accessed on the browser via:

```bash
http://34.9.173.25
```
## Justifications and Final Thoughts
### 1. Kubernetes Object Choices
1. Used StatefulSets for MongoDB for persistent storage and unique network identity.
2. Deployments were used for both backend and frontend for scalability and auto-healing.
3. Used Services for external exposure of the pods.

### 2. Method of Exposure
1. Used the LoadBalancer service in frontend-service.yaml to facilitate frontend exposure to the internet
2.  






