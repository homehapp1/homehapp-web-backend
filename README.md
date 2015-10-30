# Homehapp Web proto

TBD

## Development

Happens in "development" -branch.
All features must be done in their own separated branches and when ready a merge request needs to be created for
getting them to the development branch.

Make sure you follow the Coding Standard as defined in here: https://github.com/airbnb/javascript

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

# Docker

If you are using Kitematic, open it first and click the "Docker CLI" -button. Then navigate to the project checkout folder.

To build the Docker image

```sh
docker build -t homehapp/web:homehappweb .
```

Run the container locally with linked mongo database container (start the mongo docker before, read below how)

```sh
docker run --name homehappweb1 -d -p 3001:3001 --link mongodb:db -e DATABASE_URI="mongodb://db/homehappweb" homehapp/web:homehappweb
```

To see that everything worked (it takes a while to start as it will run in the development mode for now)

```sh
docker logs homehappweb1
```

Open your browser to your http://[DockerIP]:3001
The IP you can find either from the Kitematic UI or with "boot2docker ip" -command.

To remove the old docker image before running it again do:

```sh
docker rm homehappweb1
```

## Running Mongodb docker

### From project folder

```sh
cd support/dockers/mongodb

(docker build -t qvik/dockermongo .)

docker run --name mongodb -d qvik/dockermongo --noprealloc --smallfiles
```

### From Kitematic

Search and create MongoDB image (ie. tutum/mongodb)
Once installed, Go to the settings and find the name of the container (usually: mongodb). This will be used when connecting the containers together.
Change the environment variable "AUTH" to be "no" and restart the instance.


# Google Cloud notes

Remember to run Kitematic before trying to create the containers

Always run the following commands before executing
any of the deployment related methods!

```sh
export PROJECT_ID=homehappweb
gcloud config set project $PROJECT_ID
```

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
