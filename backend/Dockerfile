FROM node:18

WORKDIR /app

# Copy only package files first (not node_modules)
COPY package*.json ./

# Install dependencies inside the container (Linux modules)
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 5000

# Run nodemon for dev
CMD ["npm", "run", "dev"]
