# Create instance

gcloud compute instances create hh-management \
--machine-type "f1-micro" --network "default" \
--image debian-7-backports \
--tags homehapp,management

gcloud compute ssh --project $PROJECT_ID --ssh-flag="-A" homehapp@hh-management


## Connecting to Docker containers

1. ssh to management
2. ssh to Container Cluster node
3. sudo su
4. docker ps
5. docker exec -it [container id] bash
