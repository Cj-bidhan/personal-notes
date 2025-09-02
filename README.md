Welcome to Official documentation of Personal-notes-application, THIS IS NOT A README FILE. Its just documentation i created that shows lifecycle of this project development.

-This is a full-stack, beginner-friendly, Dockerized application that lets users manage their personal notes. Built from scratch for the implementation of Devops Concepts.
Note: The front end and backend are build with the help of my instructor, fellow friends, AI tools and little bit of basic knowledge of programming and insights I got from my IT background in college.

## Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB
- Reverse Proxy: Nginx 
- Deployment: Docker + Jenkins Pipelines
- Hosting: AWS EC2 (Ubuntu)

## Why build a Personal Notes application?
- Users can create, read, update, and delete personal notes (CRUD).
- It has a clean and responsive React frontend. 
- A lightweight Node.js + Express backend handles APIs. 
- MongoDB stores notes in JSON-like format. 
- It uses Docker Compose to run the app locally. 
- Uses Bitbucket Pipelines to build & deploy automatically. 
- Hosted on AWS EC2 (Ubuntu).
- Optional: Server monitoring via Prometheus + Grafana

## Step 1: Backend - Installing Dependencies

To build the server for our personal notes app, we used Node.js along with the following NPM package:

### Installed Packages
npm install express cors dotenv mongoose which is stored inside nodes_module directory

- What each package does:
- express: A lightweight web framework used to build our backend API. It handles routing, middleware, and response management.
- cors: Enables communication between our frontend (React) and backend (Node) that are hosted on different origins (ports).
- dotenv: Lets us store and access environment variables like MongoDB URI and port in a secure .env file.
- mongoose: Makes it easier to work with MongoDB by allowing us to define schemas and models (e.g., Note model), and perform database operations easily.


## Step 2:Created required Schema, Logic and API request, MVC (Model-View-Controller):
- server/models is the directory contaning blueprint or schema (note.js) that defines what a note(user entered data) should contain
- server/controllers contains the config file for logic (notesController.js), where we write the logic for CRUD operations, that user can perform.
- server/routes contains the config file for who get what request, basically, it connects the URL route with controller function.

### The main file index.js:

- `server/index.js` is the main entry point.
- It loads environment variables, connects to MongoDB, sets up middleware, and starts the server.
- Routes for the notes API are registered but will be implemented later.
- Server listens on the port defined in `.env` or defaults to 5000.

### .env why use it?
Storing sensitive data like Mongo URI , port number here prevents it from being exposed in code or version control


### Running the Server

1. Navigate to the `server` directory: cd personal-notes-app/server

2. Install dependencies : npm install

3. Start the server in develpoment mode: npm run dev; if successful , you will see:
✅ Loaded env MONGO_URI: <your MongoDB URI, from the browser or MongoDb atlas UI>
✅ Connected to MongoDB
🚀 Server running on port (your set port)

- This shows backend server is running and successfully connecting to the database

## Step 3: Frontend Creation:
1. Firstly, from our project root we executed a command npx create-react-app client, this command allowed us to create a foler called cliend, with all the required packages, dependencies and necessary files.
2. Once the folder was created, we cd into cliend, and run npm start from terminal; this opeans on the localhost:3000 with a default react page.
"NOTE: create-react-app is depreciated, meaning react no longer supports it, however, since our project is small scale, developed not for production environment, just a personal peoject, it will be fine"
3. Now the react application is created.
4. Then modified App.js, which serves as main component for UI + logic. (I have only used React and basic html, no fancy designs, just functionality)

### Tech stacks used
- React: Modern JavaScript library for building user interfaces. It makes it easy to manage state and re-render components dynamically. We used useState for managing input and notes and useEffect for fetching notes when app loads.
- FetchAPI: Simple, native JavaScript method to make HTTP requests.It sends GET, POST, PUT, and DELETE requests to the backend server to interact with the notes database.

###Dependencies and packages installed
- Default packages that comes with create-react-app

### How to run Frontend server
cd client
npm install
npm start
Loads at localhost:5000 (In this case my amazon ec2 ip)

### Step 4 Dockerization of Frontend and Backend
- Backend:
#Steps:
- Created a simple Dockerfile inside /server, that runs with command docker run -d -p 5000:5000 --env-file .env personal-notes-backend
- Added --env-file .env because the URI and creds for mongoDB atls is stored in .env file.
- Created docker ignore to avoid pushing creds files and other config files to repositories.

- Frontend:
#Steps:
- Created a simple Dockerfile inside /client, that runs with command docker run -d -p 3000:80 personal-notes-frontend 
- USes nginx;alpine, a lightweight file server, which listens on port 80.

--- Following the dockerization, now we dont need to run npm run dev from server directory and npm start from client directory, our docker containers will do that for us.

### Step 5: Added docker-compose
Note that we have to run 2 different docker containers just to get our application starting. This is where docker-compose comes. I have created a docker.compose.yml file in the root directory of the project with the command docker-compose --build -d. This builds a centralized docker container which fireups both docker containers; personal-notes-backend and personal-notes-frontend. With this, we can run our project with a single command from our root directory.
- If we need to stop the application from running: docker-compose down (this stops and removes the container)
- If we need to re-start the application: docker-compose up -d (this re builds and runs the program, in detached mode)

### Step 6:  Nginx and reverse proxy
Deployed a React frontend and Node.js backend using Docker Compose and used Nginx as a reverse proxy to:
- Serve the frontend (React build files).
- Forward API requests to the backend without exposing a separate port.
- Link both frontend and backend to a single domain: demo-notes.bidhanghimire420.com.np.

## conf file
Created a default.conf file inside nginx directory (which is located in root project dir), which basicaly does following:
- / → sends all normal requests to frontend container.
- /api → sends all API requests to backend container.
- proxy_set_header lines ensure headers are forwarded properly.
- proxy_http_version 1.1 is needed for WebSocket or keep-alive connections
- in server_name we added our sub-domain, which is demo-notes.bidhanghimire420.com.np

Note: we also adjusted the react api URL fix:
in App.js (path: personal-notes-app/client/src), we changed the const API_URI = "api/notes", because we now pass requests
through nginx and we dont need to point to the hardcoded backend link

### Why Reverse proxy??
A reverse proxy is a server that sits between clients (browsers) and application servers.
Instead of clients talking directly to your backend, they send requests to Nginx, which then:
- Serves static frontend files (index.html, JS, CSS).
- Forwards /api requests to the backend service.
Why we use it:
-  Single entry point for both frontend and backend.
-  Easier SSL setup. 
-  Hides backend ports from public internet.

### More about bidhanghimire420.com.np
I have used a dns record (A records) in cloudfare to create and point domains/subdomains to our ec2 server,
meaning, i have linked those domains/sub-domains with my Ec2's elastic IP address. Now the website opeans at 
				demo-notes.bidhanghimire420.com.np

### Configured in docker-compose.yml
Added nginx service in our docker-compose file, so when next time we run docker-compose uo -d, three containers spawn up, inside docker-compose network
one frontend, one backend and one nginx which acts as a brigde between frontend nad backend (i.e. re-routes based on api calls either to frontend or backend)


#ARCHITECTURE DIAGRAM:
                ┌─────────────────────────────────┐
                │        User's Browser            │
                │  demo-notes.bidhanghimire420.com │
                └─────────────────────────────────┘
                               │
                               ▼
                 ┌────────────────────────┐
                 │    Nginx Reverse Proxy  │  (Container)
                 │  Port 80 on Host EC2    │
                 └────────────────────────┘
                   │                   │
          ┌────────┘                   └─────────┐
          ▼                                        ▼
 ┌──────────────────┐                    ┌──────────────────┐
 │  Frontend (React) │                    │ Backend (Node.js)│
 │ Container:80      │                    │ Container:5000   │
 └──────────────────┘                    └──────────────────┘
                                                      │
                                                      ▼
                                         ┌────────────────────────┐
                                         │ MongoDB Atlas (Cloud)  │
                                         └────────────────────────┘


##Securing with SSL and Certbot
Right now:
- Nginx reverse proxy is working for demo-notes.bidhanghimire420.com.np
- It’s serving HTTP only (port 80)
- We want HTTPS (port 443) with a green lock in the browse
To do this:
- Certbot will talk to Let’s Encrypt and verify the domain ownership
  (like proving to a bank that you own a house before they give you the keys)
- Let’s Encrypt gives us .pem files (SSL cert + private key)
- Nginx will be configured to use those files for secure connections
- Certbot will be run in Docker so it doesn’t mess with the host system

To achieve this firstly we updated the docker-compose.yaml file and added a certbot container alonside nginx container.
Then edited default.conf file to allo certbot to respond to Let's encrypt verifycation challenge. Then installed certbot (inside docker, not on host) using the following command:
sudo docker-compose run certbot certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email <your-email@gmail.com> \
  --agree-tos \
  --no-eff-email \
  -d demo-notes.bidhanghimire420.com.np

Finally, we changed the folder persmissions and setuped a cronjob that runs everyday at 3.30 AM, which first checks the validity
of the certificate and if it's near expiery date, it renews (certificate expries after 90 days)


##The Architecture Diagram/ Flow chart


[User]  <--HTTPS-->  [Nginx Reverse Proxy Container]
                            |
        ------------------------------------------------
        |                                              |
[Frontend Container]                             [Backend Container]
      (React UI)                                    (API server)
                            |
                   [Certbot Container]
                            |
          (Creates and renews SSL certificates)



## Step 7: Jenkins setup and CI/CD preparation
1. Jenkins Setup on EC2 (CI Server):
- Launched a new EC2 (Ubuntu) for Jenkins (3.6.254.90), then installed Jenkins, Java, Docker, Docker Compose.
- Unlocked Jenkins and completed the initial setup.
- Installed required plugins: Pipeline, GitHub Integration, SSH Agent, Docker Pipeline.

2. GitHub Webhook Integration
- Created a Personal Access Token (classic, with repo + admin:repo_hook) on GitHub.
- Added GitHub credentials in Jenkins.
- Configured webhook in GitHub repo → pointed to http://3.6.254.90:8080/github-webhook/.
- Verified connection: Jenkins received PING webhook successfully.

3. SSH Key Setup (CI → App EC2)
- Generated a dedicated SSH keypair (id_jenkins_ed25519) on Jenkins EC2.
- Added public key to ~/.ssh/authorized_keys of App EC2 (where frontend/backend run: 3.110.14.32).
- Verified passwordless SSH works.

4. Docker Hub Preparation
- Created repos on Docker Hub: pnotes-frontend and pnotes-backend
- Created an Access Token in Docker Hub for Jenkins push.
- Added credentials in Jenkins (dockerhub-cred).

5. Jenkinsfile Pipeline
- Defined a multistage pipeline with these steps:
    Checkout – pull latest GitHub code.
    Docker Login – authenticate with Docker Hub.
    Build & Push – build frontend + backend images, tag with commit SHA + latest, push to Docker Hub.
    Deploy (App EC2) – SSH into App EC2.
    Write .env.deploy with correct image tags.
    Run:
     - docker compose --env-file .env.deploy -f docker-compose.prod.yml pull
     - docker compose --env-file .env.deploy -f docker-compose.prod.yml up -d --remove-orphans

Note: We have used Jenkins CI on seperate server(3.6.254.90)  and CD project-server on sepreate server(3.110.14.32). This type of build is centralized 
and not on the production machine. 

6. Creation of docker-compose.prod.yml
This is just a simple scripe that doesnot builds any thing instead pulls the image,( ${IMAGE}:${TAG} ) that Jenkins pushed.

7. Summary:

                     --------“CI builds immutable Docker images tagged by commit SHA.
                              CD pulls those exact tags on EC2 via SSH and restarts via Compose.
                              Rollback is as easy as redeploying the previous SHA.
                              Nginx handles reverse proxy + SSL via Let’s Encrypt certbot (also automated renewal).
                              I separated dev compose (build from source) from prod compose (pull images).
                              Secrets are outside version control (server/.env).
                              Webhooks trigger the pipeline automatically on push.”-----------


###Jenkinsfile Explanation:

The Jenkinsfile is a declarative pipeline with the following stages:
- Checkout Code: Pulls the latest code from GitHub using github-cred.
- Docker Login: Logs into Docker Hub with dockerhub-creds using withCredentials. This ensures Docker images can be pushed.
- Build & Push Frontend Image: Builds the frontend Docker image from client/Dockerfile and pushes it to Docker Hub.
- Build & Push Backend Image: Builds the backend Docker image from server/Dockerfile and pushes it to Docker Hub.
- Deploy to Server: Uses sshagent to SSH into EC2, pulls the latest code, and runs:
                docker-compose -f docker-compose.prod.yml down
                docker-compose -f docker-compose.prod.yml up -d
- This deploys the application using the updated Docker images. All required environment variables (FRONTEND_IMAGE, BACKEND_IMAGE, FRONTEND_TAG, BACKEND_TAG) must be set.

Key Points:
- withCredentials securely handles sensitive information like Docker passwords.
- env variables handle Docker image names and tags dynamically.
- Post actions in Jenkins report pipeline success or failure.
- The pipeline fully automates build → push → deploy.

###UPDATE: Due to cost issues, i have decided to terminate Jenkins server on AWS
- I move on to jenkins locally on my laptop
- This means, we will be needing tool like ngrok to get a public url so that github can communicate with jenkins and trigger
  the CICD peocess.
-  
