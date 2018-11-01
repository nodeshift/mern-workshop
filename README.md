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
- `docker pull mongodb`
- `docker run -d -p 27017:27017 mongo `
- `docker inspect <MongoDB container name> | grep IPAddress`
- `export MONGO_URL=<the IP address from above>`
- `docker run -p 3000:3000 -e MONGO_URL=$MONGO_URL backend:v1.0.0`
- `docker run -p 3001:3001 frontend:v1.0.0`

## Quickstart for Kubernetes
Requires building the images first, see the quickstart for Docker section.

- Set your Kubernetes context so you're pointing to a Kubernetes environment.
- `helm install --name mongo --set usePassword=false,replicaSet.enabled=true,service.type=LoadBalancer,replicaSet.replicas.secondary=3 stable/mongodb`
- `helm install --name backend backend/chart/backend`
- `helm install —-name frontend frontend/chart/frontend`
