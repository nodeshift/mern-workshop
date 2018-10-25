MEAN workshop intended for Node Conf EU

# Requirements
- Docker - https://docs.docker.com/install/
- Kubernetes for Docker - Docker > Preferences > Enable Kubernetes . Make sure Docker > Kubernetes is pointed to `docker-for-desktop` and not `minikube` etc.
- Kubectl - `brew install kubernetes-cli` or https://kubernetes.io/docs/tasks/tools/install-kubectl/
- Node.js - https://nodejs.org/en/ (Node 8 LTS) or NVM https://github.com/creationix/nvm.git
- Helm -

```
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```


# Steps

1. Clone the MERN starter: `git clone https://github.com/IBM/MERN-app`
1. Build the project with all dependencies, including dev dependencies, with the command:

    ```bash
    npm install
    ```

1. Start a mongodb docker container

  ```bash
   docker run -d -p 27017:27017 mongo
  ```

1. Run the app in dev mode with the command:

  ```bash
  npm run dev
  ```

  A development web server runs on port 3000 and the app itself runs on port 3100. The web server and app will automatically reload if changes are made to the source.

1. Go to the app at https://localhost:3000 and take a look at some of the API routes, e.g https://localhost:3000/comments

1. Go to https://localhost:3000/appmetrics-dash. In a separate window hit the https://localhost:3000/comments route to see the graphs track the requests.

1. Input some comments into the API using the following commands

```
curl -c cookie.txt -X POST \
  http://localhost:3000/api/comments/login \
  -H 'Content-Type: application/json' \
  -d '{"author":"Beth", "imageURL":"404", "twitter":"BethGriggs_"}'
```

```
curl -b cookie.txt -X POST \
  http://localhost:3000/api/comments \      
  -H 'Content-Type: application/json' \
  -d '{"text":"Hello World!"}'   
```

## Initialize Helm


1. Initialize the local CLI and also install Tiller into your configured Kubernetes cluster in one step:

```
helm init
```

## Deployment to Kubernetes

1. Build and tag the app with Docker: `docker build -t mern-app:v1.0.0 .`
1. Look at helm chart and ensure it refers to the image we just built and tagged above:

```
repository: mern-app
tag: v1.0.0
pullPolicy: IfNotPresent
```

1. In the root of the project `helm install --name mern-app chart/mernexample`
1. Check all pods come up with `kubectl get pods`

## Checking it works

1. View the application go to `http://<cluster-external-IP>:<external-port>` in a browser. It should look something like this: `http://169.47.252.58:32080`


Lastly, we'll need the external port. This was already given to us in the previous step after the `helm` command, but you can find it using:

```
$ kubectl get services
NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)           AGE
kubernetes            ClusterIP   172.21.0.1       <none>        443/TCP           17h
mernexample-service   NodePort    172.21.231.153   <none>        3000:32080/TCP    5h
mongo                 NodePort    172.21.67.175    <none>        27017:30308/TCP   5h
```

Where the column labeled `PORT(S)` has two values. The port number on the left is the internal / guest port from the container. The port number on the right is the external port. The external port is what you will use to access your application.
