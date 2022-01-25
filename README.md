# mern-workshop

Instructions and code to deploy MongoDB, a backend Node.js microservice that connects to it, and a frontend that connects to the backend.

The frontend uses React and is served with nginx.

The backend uses Express and features a `/api/todos` endpoint with CRUD operations enabled.

MongoDB is deployed with persistence and replicas: this is where todo items are stored.

Tested using the Kubernetes service provided by [Docker for Desktop on Mac](https://docs.docker.com/docker-for-mac/kubernetes/).

## Quickstart for local development
- Deploy MongoDB as a Docker container or on Kubernetes first
- `cd backend`
- `npm install`
- `npm start`
- `cd ../frontend`
- `npm install`
- `npm start`

## Quickstart for Docker
- `docker build -f frontend/Dockerfile -t frontend:v1.0.0 frontend`
- `docker build -f backend/Dockerfile  -t backend:v1.0.0 backend`
- `docker pull mongo`
- `docker run -d -p 27017:27017 --name mern-mongo mongo `
- `export MONGO_URL=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mern-mongo)`
- `docker run -p 30555:30555 -e MONGO_URL=$MONGO_URL backend:v1.0.0`
- In a new Terminal - `docker run -p 3001:80 frontend:v1.0.0`

## Quickstart for Docker-Compose
You can use docker-compose to quickly deploy multiple services at once.

- Create a file called `docker-compose.yaml` at the root of the project and copy copy/paste the following yaml:

```
version: '3'
services:
  frontend:
    build: ./frontend
    ports:
      - 3001:80
    links:
      - backend
  backend:
    build: ./backend
    ports:
      - 30555:30555
    environment:
      - MONGO_URL=mongo
    links:
      - mongo
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
```
- Run `docker-compose up` to deploy the services.

## Quickstart for Kubernetes
Requires building the images first, see the quickstart for Docker section.

- Set your Kubernetes context so you're pointing to a Kubernetes environment.
- `helm repo add bitnami https://charts.bitnami.com/bitnami`
- `helm install mongo --set auth.enabled=false,replicaSet.enabled=true,service.type=LoadBalancer,replicaSet.replicas.secondary=3 bitnami/mongodb`
- `helm install backend backend/chart/backend`
- `helm install frontend frontend/chart/frontend`
