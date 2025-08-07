# Step 1: Build the React app
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve it with Nginx
FROM nginx:alpine

# Remove default nginx homepage
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Add custom nginx config later
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
