# Step 1: Use Alpine base image for a lighter image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Install dependencies: copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install production dependencies only (for faster install and smaller image size)
RUN npm ci --only=production

# Install Angular CLI locally instead of globally
RUN npm install @angular/cli@latest

# Copy the rest of the application code
COPY . .

# Build the Angular app in production mode
RUN npx ng build --configuration=production

# Step 2: Use a minimal nginx-alpine base image for serving the built Angular app
FROM nginx:alpine

# Use a custom Nginx configuration (optional if you need SPA routing support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from the 'build' stage to NGINX's html folder
COPY --from=build /app/dist/library-management.web /usr/share/nginx/html

# Copy SSH configuration files to enable secure shell access to the container
COPY sshd_config /etc/ssh/
COPY entrypoint.sh ./

# Install OpenSSH server, set root password, and generate SSH host keys
RUN apk add openssh \
    && echo "root:Docker!" | chpasswd \
    && chmod +x ./entrypoint.sh \
    && cd /etc/ssh/ \
    && ssh-keygen -A

# Expose port 80 for HTTP traffic and port 2222 for SSH access
EXPOSE 80 2222

# # Command to start the SSH service and run NGINX in the foreground
# CMD /usr/sbin/sshd && exec nginx -g 'daemon off;'

# Command to start the SSH service and run NGINX in the foreground
ENTRYPOINT [ "./entrypoint.sh" ]
#CMD ["/bin/sh", "-c", "/usr/sbin/sshd && exec nginx -g 'daemon off;'"]
