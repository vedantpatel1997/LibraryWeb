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

# Set working directory
WORKDIR /app

# Use a custom Nginx configuration (optional if you need SPA routing support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from the 'build' stage to NGINX's html folder
COPY --from=build /app/dist/library-management.web /usr/share/nginx/html

# Copy SSH configuration files to enable secure shell access to the container
COPY sshd_config /etc/ssh/
COPY entrypoint.sh /entrypoint.sh

# Install OpenSSH server and required utilities
RUN apk add --no-cache \
    openssh \
    iputils \
    net-tools \
    tcpdump \
    curl \
    bind-tools \
    busybox-extras \
    tcptraceroute \
    lsof \
    procps \
    htop \
    vim \
    tcpflow \
    nmap \
    mtr \
    iperf \
    && curl -o /usr/bin/tcpping http://www.vdberg.org/~richard/tcpping \
    && chmod 755 /usr/bin/tcpping \
    && echo "root:Docker!" | chpasswd \
    && chmod +x /entrypoint.sh \
    && ssh-keygen -A

# Expose port 8080 for HTTP traffic and port 2222 for SSH access
EXPOSE 8080 2222

# Set the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]



# az login
# az acr login --name libraryacr
# docker build -t libraryacr.azurecr.io/library:frontend .
# docker build -t libraryacr.azurecr.io/library:backend .
# docker push libraryacr.azurecr.io/library:frontend
# docker push libraryacr.azurecr.io/library:backend