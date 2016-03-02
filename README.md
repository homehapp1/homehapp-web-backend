# Homehapp Web

TBD

## Development

Happens in "development" -branch.
All features must be done in their own separated branches and when ready a merge request needs to be created for
getting them to the development branch.

Make sure you follow the Coding Standard as defined in here: https://github.com/airbnb/javascript

Export following to the terminal where you are running the server:

```sh
export GOOGLE_APPLICATION_CREDENTIALS=google-service-key.json
```

### Loading fixture data to database

To load fixtures to database run:

```sh
npm run migrate init applyFixtures
```

# Private and Public Keys for token Authentication

```sh
openssl genrsa -out auth-private.pem 2048
openssl rsa -in auth-private.pem -outform PEM -pubout -out auth-public.pem
```

# Google Cloud notes

Remember to run Kitematic before trying to create the containers

Always run the following commands before executing
any of the deployment related methods!

```sh
export PROJECT_ID=homehappweb
gcloud config set project $PROJECT_ID
```

You need to have the gcloud crendentials also set. To list the available
clusters

gcloud container clusters list
gcloud container clusters get-credentials homehapp-prod
gcloud container clusters get-credentials homehapp-stg

## Initial steps before creating clusters

Following are only done if creating the clusters for first time.

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

## Creating clusters

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

## Updating clusters

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

# Administration First-run

Credentials:
admin@homehapp.com / ekb7iLMGQsHYL2nr5OMnf88+IuHn5jDg

# Run locally

1. Start Mongo with `mongod`
  - check *Loading fixture data to database* on the first run or
    to create local content
2. For running the site use `npm run dev`
3. For running the admin interface use `npm run dev-admin`
4. For running the mobile api use `npm run dev-api`

# Endpoints

- Production site: https://www.homehapp.com/
- Production admin: https://admin.homehapp.com/
- Production mobile API: https://mobile-api.homehapp.com/
- Production mobile API documentation: https://mobile-api.homehapp.com/api-docs/
- Staging site: http://alpha.homehapp.com:8080/
- Staging admin: http://staging-admin.homehapp.com:8080/
