#!/bin/bash

# As it's labelled we can restart it this way and any changes to the Docker image on this machine
# will be picked up
kubectl delete pod -l app=backend-selector
