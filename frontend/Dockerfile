# Stage: Development environment
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Enable live reloading
ENV CHOKIDAR_USEPOLLING=true
EXPOSE 3000

# Run the React dev server
CMD ["npm", "start"]
