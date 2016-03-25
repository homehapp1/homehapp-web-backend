# Local development environment

## Dependencies

* Node.JS (Supported versions: 0.12.x,4.x,5.x)
* NPM
* MongoDB

## Installing

After cloning the repository, go to the cloned directory and execute:

```sh
npm install
```

### Loading fixture data to database

To load fixtures to database run:

```sh
npm run migrate init applyFixtures
```

## Running

Make sure your MongoDB is running!


To run the Website project with auto-restart execute:

```sh
npm run dev
```

To run the Administration project with auto-restart execute:

```sh
npm run dev-admin
```

To run the Mobile API project with auto-restart execute:

```sh
npm run dev-api
```

