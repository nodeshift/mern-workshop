# MERN example: frontend repository, see the backend repository for more details
Heavily modified version of the [IBM mern-app example](https://github.com/IBM-Cloud/MERN-app).

Optimised to work in local environments for demonstrative and education purposes.

### Docker

Install Docker on your Mac.

```
docker build -t frontend:v1.0.0 .
docker run -p 3001:3001 -e frontend:v1.0.0
```

### Kubernetes

Use the Docker system tray (click the whale in the top right corner) then go to Preferences -> Advanced -> Enable Kubernetes, choose Kubernetes as the orchestrator and to show system containers. Apply and restart Docker, waiting for Kubernetes to be reported as available.

Check `values.yaml` points to the image you've built, e.g. `frontend:v1.0.0`.

Deploy MongoDB into your cluster with `helm install --name mongo --set usePassword=false,replicaSet.enabled=true,service.type=LoadBalancer,replicaSet.replicas.secondary=3 stable/mongodb`

MongoDB has a variety of [configuration options](https://github.com/helm/charts/tree/master/stable/mongodb) you can provide with `--set`.

Deploy this Node.js application into your cluster with  `helm install --name nodeapp chart/mernexample`. 

This Node.js application connects to the MongoDB service and will retry on connection loss (so the MongoDB pod can be killed).

Data from MongoDB is persisted at `$HOME/.docker/Volumes/mongo-mongodb`.

Tested on Mac with Kubernetes (docker-for-desktop).

### Deploying our frontend
- `helm install --name backend chart/frontend`

### Deploying the backend
See the backend repository. Frontend listens on port 3001, backend listens on port 3000.
