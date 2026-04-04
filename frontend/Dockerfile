# Stage: Development environment
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

EXPOSE 3000

# Run the Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
