# Cluster setup.

These are the steps that has been used to create the Kubernetes Cluster for the project.
These are here just for documentations sake. Do not run these again.

## Google Cloud notes

Remember to run Kitematic (found inside Docker toolkit) before trying to create the containers.

Always run the following commands before executing
any of the deployment related methods!

```sh
export PROJECT_ID=homehappweb
gcloud config set project $PROJECT_ID
```

## Perparations

Following are only done if creating any cluster for first time.

Create and push the logger container

```sh
cd support/docker/fluentd-sidecar-gcp
make build push
cd ../../../
```

Create and push the nginx proxy container

```sh
cd support/dockers/nginx-proxy
make build push
cd ../../../
```

## Creating Clusters

0. For staging do

export CLUSTER_ENV=stg

0. For production do

export CLUSTER_ENV=prod

1. Create and push the containers

```sh
./support/createContainers.sh $CLUSTER_ENV site
./support/createContainers.sh $CLUSTER_ENV admin
./support/createContainers.sh $CLUSTER_ENV api
```

2. Initialize the cluster

This will create the container cluster nodes

```sh
./support/initCluster $CLUSTER_ENV
```

3. Setup the containers to run inside the cluster

This will deploy and configure the controllers and services
for the project.

3.1 STAGING

```sh
./support/setupCluster.sh $CLUSTER_ENV site
./support/setupCluster.sh $CLUSTER_ENV admin
./support/setupCluster.sh $CLUSTER_ENV api
```

3.2 PRODUCTION

When setuping the production environment you need to add the
certificate path prefix as last argument.

```sh
./support/setupCluster.sh $CLUSTER_ENV site certs/homehapp_com/star_homehapp_com
./support/setupCluster.sh $CLUSTER_ENV admin certs/homehapp_com/star_homehapp_com
./support/setupCluster.sh $CLUSTER_ENV api certs/homehapp_com/star_homehapp_com
```