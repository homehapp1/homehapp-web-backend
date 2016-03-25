# Homehapp Web

## Development

Happens in "development" -branch.
All features must be done in their own separated branches and when ready a merge request needs to be created for
getting them to the development branch.

Make sure you follow the Coding Standard as defined in here: https://github.com/airbnb/javascript

Export following to the terminal where you are running the server:

```sh
export GOOGLE_APPLICATION_CREDENTIALS=google-service-key.json
```

Make sure you have read the LOCAL_SETUP.md file for local dependencies and initial development setup.

# Cluster creation and updates

See CLUSTER_SETUP.md and CLUSTER_UPDATE.md files.

# Private and Public Keys for token Authentication

This is the command used to create the original authentication keys. Do not replace these!

```sh
openssl genrsa -out auth-private.pem 2048
openssl rsa -in auth-private.pem -outform PEM -pubout -out auth-public.pem
```

# Administration First-run

Credentials:
admin@homehapp.com / ekb7iLMGQsHYL2nr5OMnf88+IuHn5jDg

# Endpoints

- Production site: https://www.homehapp.com/
- Production admin: https://admin.homehapp.com/
- Production mobile API: https://mobile-api.homehapp.com/
- Production mobile API documentation: https://mobile-api.homehapp.com/api-docs/
- Staging site: http://alpha.homehapp.com:8080/
- Staging admin: http://staging-admin.homehapp.com:8080/
