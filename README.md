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

