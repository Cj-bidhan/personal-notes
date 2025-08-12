Troubleshooting Notes – Personal Notes App: Below are the problems i faced and their solotions mentioned whine key setup parts of this project.


1. Project Kickoff

Goal: Build a full-stack Personal Notes app with React (frontend), Node.js + Express + MongoDB (backend), Docker, Nginx, Bitbucket CI/CD, and optional monitoring.


2. Backend & Frontend Development

✅ Backend (Node.js + Express + MongoDB)

    Issue: CORS errors when frontend tried to fetch data.
    Cause: Backend was not allowing requests from frontend’s origin.
    Solution: Installed cors package and configured it with frontend’s URL.

    Issue: MongoDB connection errors when deploying locally or in containers.
    Cause: Wrong MongoDB URI or .env variables not loaded.
    Solution: Created .env file, used dotenv to load variables, confirmed correct MongoDB URI format:

    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>

✅ Frontend (React)

    Issue: API calls failing due to hardcoded backend URL.
    Cause: Frontend API endpoint pointing to localhost:5000 instead of server hostname.
    Solution: Used .env in React (REACT_APP_API_URL) and referenced it in fetch calls.

3. Dockerization


✅ Backend Dockerization

    Issue: docker run without --env-file caused DB connection failure.
    Cause: Container didn’t have .env variables.
    Solution: Used:

    docker run -d -p 5000:5000 --env-file .env personal-notes-backend


✅ Frontend Dockerization

    Issue: React app didn’t load styles/images in container.
    Cause: React build directory not served properly in Nginx container.
    Solution: Used nginx:alpine as base image, copied build/ folder, and set COPY ./nginx.conf for correct serving.


4. Docker Compose Integration

    Issue: Backend couldn’t connect to MongoDB when running via docker-compose.
    Cause: In Docker network, localhost refers to the container itself, not the host machine.
    Solution:

        Used external MongoDB Atlas (cloud-based) so URI stayed the same.

        Ensured .env file is loaded in docker-compose.yml under backend.

    Issue: Backend exposed port not accessible in Compose.
    Cause: Used ports incorrectly.
    Solution: Switched from ports to expose in Compose when only internal communication was needed.


5. Nginx Reverse Proxy Setup

✅ Objective: Serve frontend & backend through a single domain with Nginx inside Docker.

    Issue: Only frontend loaded; backend API calls failed.
    Cause: Nginx config didn’t have /api location block.
    Solution: Added:

location /api/ {
    proxy_pass http://backend:5000/;

    Issue: DNS domain didn’t point to server.
    Cause: Cloudflare DNS not set correctly.
    Solution: Set A record for demo-notes.bidhanghimire420.com.np → EC2 public IP.

    Issue: Conflicts with host Nginx service.
    Cause: Host OS was already running Nginx on port 80.
    Solution: Stopped and disabled host Nginx:
              sudo systemctl stop nginx
              sudo systemctl disable nginx

    Issue: Wrong server_name
    Cause: Placeholder domain in config.
    Solution: Updated:

    server_name demo-notes.bidhanghimire420.com.np;


✅ Final Docker Compose for Nginx:

version: '3.8'

services:
  backend:
    build:
      context: ./server
    container_name: personal-notes-backend
    restart: always
    env_file:
      - ./server/.env
    expose:
      - "5000"

  frontend:
    build:
      context: ./client
    container_name: personal-notes-frontend
    restart: always
    expose:
      - "80"

  nginx:
    image: nginx:latest
    container_name: nginx-reverse-proxy
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend

✅ Final Nginx Config (nginx/default.conf):

server {
    listen 80;

    server_name demo-notes.bidhanghimire420.com.np;

    location / {
        proxy_pass http://frontend:80;
    }

    location /api/ {
        proxy_pass http://backend:5000/;
    }
}

Key Lessons Learned

    Save .env variables in Docker builds — containers don’t inherit host environment.

    localhost inside Docker ≠ your PC — use service names in Compose.

    Reverse proxy simplifies domain access and hides multiple ports.

    Cloudflare DNS needs correct A/AAAA records for domains/subdomains.

    Always stop host services conflicting with Docker ports.



## 5. Certbot Fails Challenge (404 on ACME challenge path)
- **Problem:** LetsEncrypt CA cannot find challenge files due to wrong webroot path or Nginx config.
- **Solution:** Use `alias` directive in Nginx for `.well-known/acme-challenge` location, e.g.:

location /.well-known/acme-challenge/ {
alias /var/www/certbot/.well-known/acme-challenge/;
try_files $uri =404;
}

- Confirm that volume mapping for certbot webroot is consistent between nginx and certbot containers.

---

## 6. Docker Volume Permission Issues
- **Problem:** Certbot cannot write challenge files to mounted volume.
- **Solution:** Ensure directory permissions allow write access by container user, or fix ownership on host.

---

## 7. Certificate Renewal Script Fails to Run `renew` Command
- **Problem:** Using `docker-compose run certbot renew` leads to `executable file not found`.
- **Solution:** Run as:

docker-compose run certbot certbot renew

Not just `renew`.

---

## 8. Cron Job Not Running or Permission Issues
- **Problem:** Renewal cron job fails silently.
- **Solution:** Log cron output to a file; ensure script has execute permissions; use absolute paths in script and cron.

---

## 9. DNS Record Misconfiguration
- **Problem:** Domain or subdomain doesn’t resolve to EC2 IP.
- **Solution:** Check DNS A records in domain provider dashboard, use `dig` or `nslookup` to verify.

---

## 10. Docker Compose File Mistakes
- **Problem:** Confusing `ports` vs `expose`, missing volumes or wrong paths.
- **Solution:** Use `ports` to publish host ports, `expose` only for inter-container communication.

---

## 11. React Frontend API URL Hardcoded to IP
- **Problem:** React app fetches backend via IP, breaking when domain used.
- **Solution:** Use relative URLs or environment variables to handle API base URL dynamically.

---

# General Tips
- Always check container logs with `docker-compose logs [service]`.
- Test Nginx config with `nginx -t` inside the container or host.
- Restart Docker daemon if weird networking issues occur.
- Use `curl` and `wget` inside containers to test connectivity.

---

This document will be updated continuously as project progresses.
