# Updating Clusters

## Google Cloud notes

Remember to run Kitematic (found inside Docker toolkit) before trying to create the containers.

Always run the following commands before executing
any of the deployment related methods!

```sh
export PROJECT_ID=homehappweb
gcloud config set project $PROJECT_ID
```

You need to have the gcloud crendentials also set.

To list the available clusters:
```sh
gcloud container clusters list
```

To fetch the credentials for the Homehapp clusters:
```sh
gcloud container clusters get-credentials homehapp-prod
gcloud container clusters get-credentials homehapp-stg
```

## Updating clusters

When you want to update the project parts to newer version, remember to first commit your changes to repository
and only after that run these commands.

To update only specific project, run the project name related commands only.

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

2. Update the controllers

```sh
./support/updateCluster.sh $CLUSTER_ENV site
./support/updateCluster.sh $CLUSTER_ENV admin
./support/updateCluster.sh $CLUSTER_ENV api
```

3. Updating site assets

Build the site static files

```sh
npm run build-site
npm run build-admin
```

Run the distribution script to propagate files to CDN

```sh
npm run distribute-site
npm run distribute-admin
```
