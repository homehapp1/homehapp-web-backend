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

```sh
export PROJECT_ID=homehappweb
gcloud config set project $PROJECT_ID
```

```sh
cd support/docker/fluentd-sidecar-gcp
make build push
cd ../../../
```

Creating Staging containers (add 1 as last argument to clear old containers)

```sh
./support/createContainers.sh site stg
./support/createContainers.sh admin stg
./support/createContainers.sh api stg
```

These are run only when creating the clusters, not when updating them

```sh
./support/createCluster.sh site stg
./support/createCluster.sh admin stg
./support/createCluster.sh api stg
```

```sh
./support/updateCluster.sh site stg
./support/updateCluster.sh admin stg
./support/updateCluster.sh api stg
```

# Updating site assets

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

# Run locally

1. Start Mongo with `mongod`
  - check *Loading fixture data to database* on the first run or
    to create local content
2. For running the site use `npm run dev`
3. For running the admin interface use `npm run dev-admin`

# Production infrastructure

Creating Production containers (add 1 as last argument to clear old containers)

```sh
./support/createContainers.sh site prod
./support/createContainers.sh admin prod
./support/createContainers.sh api prod
```

### Create

```sh
export PROJECT_ID=homehappweb
gcloud config set project $PROJECT_ID
```

```sh
cd support/dockers/nginx-proxy
make build push
cd ../../../
```

```sh
./support/production/createCluster.sh site certs/homehapp_com/star_homehapp_com
./support/production/createCluster.sh admin certs/homehapp_com/star_homehapp_com
./support/production/createCluster.sh api certs/homehapp_com/star_homehapp_com
```

Administration first run:
admin@homehapp.com / ekb7iLMGQsHYL2nr5OMnf88+IuHn5jDg

### Update

```sh
./support/production/updateCluster.sh site
./support/production/updateCluster.sh admin
./support/production/updateCluster.sh api
```
