# Homehapp Web proto

TBD

## Development

Happens in "development" -branch.
All features must be done in their own separated branches and when ready a merge request needs to be created for
getting them to the development branch.

Make sure you follow the Coding Standard as defined in here: https://github.com/airbnb/javascript

### Loading fixture data to database

To load fixtures to database run:

    npm run migrate init applyFixtures

# Docker

If you are using Kitematic, open it first and click the "Docker CLI" -button. Then navigate to the project checkout folder.

To build the Docker image

    docker build -t homehapp/web:homehappweb .

Run the container locally with linked mongo database container (start the mongo docker before, read below how)

    docker run --name homehappweb1 -d -p 3001:3001 --link mongodb:db -e DATABASE_URI="mongodb://db/homehappweb" homehapp/web:homehappweb

To see that everything worked (it takes a while to start as it will run in the development mode for now)

    docker logs homehappweb1

Open your browser to your http://[DockerIP]:3001
The IP you can find either from the Kitematic UI or with "boot2docker ip" -command.

To remove the old docker image before running it again do:

    docker rm homehappweb1

## Running Mongodb docker

### From project folder

    cd support/dockers/mongodb

    (docker build -t qvik/dockermongo .)

    docker run --name mongodb -d qvik/dockermongo --noprealloc --smallfiles

### From Kitematic

Search and create MongoDB image (ie. tutum/mongodb)
Once installed, Go to the settings and find the name of the container (usually: mongodb). This will be used when connecting the containers together.
Change the environment variable "AUTH" to be "no" and restart the instance.


# Google Cloud notes

export PROJECT_ID=homehappweb

cd support/docker/fluentd-sidecar-gcp
make build push

./support/createContainers.sh site
./support/createContainers.sh admin

cd ../../../
./support/createCluster.sh site
./support/createCluster.sh admin

./support/updateCluster.sh site stg
./support/updateCluster.sh admin stg
