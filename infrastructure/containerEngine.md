cd support/docker/fluentd-sidecar-gcp
PROJECT_ID=homehappweb make build push

gcloud beta container clusters create homehapp-site \
    --num-nodes 1 \
    --machine-type g1-small

kubectl create -f infrastructure/configs/site-controller.json

kubectl get pods -l projectName=site -o wide

kubectl create -f infrastructure/configs/site-service.json

kubectl get services
kubectl get rc

gcloud compute firewall-rules create hh-site-8080 --allow tcp:8080 \
    --target-tags gke-homehapp-site-7ad9580f-node

kubectl describe services site | grep "LoadBalancer Ingress"

PROJECT_ID=homehappweb ./support/createContainers.sh site

kubectl rolling-update site-controller --image=eu.gcr.io/homehappweb/site:$(git rev-parse --short HEAD)-stg



(kubectl rolling-update site-controller -f infrastructure/configs/site-controller.json)






kubectl delete services admin
kubectl stop rc admin-controller
gcloud beta container clusters delete homehapp-admin
gcloud compute firewall-rules delete hh-admin-8080
