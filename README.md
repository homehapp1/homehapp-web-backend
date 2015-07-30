# Homehapp Web proto

TBD

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
