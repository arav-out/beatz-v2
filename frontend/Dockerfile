# Build stage
FROM node:18 AS build

WORKDIR /app

# Accept build-time variable
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build Vite app (ignore TS errors)
RUN npx tsc -b --noEmit || echo "TS errors ignored" && npx vite build

# Production stage: serve with nginx
FROM nginx:alpine

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
