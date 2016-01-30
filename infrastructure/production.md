## Generating CSR

```sh
mkdir -p certs/homehapp_com
cd certs/homehapp_com
openssl req -nodes -newkey rsa:2048 -keyout star_homehapp_com.key -out star_homehapp_com.csr
```

```
Country Name (2 letter code) [AU]:GB
State or Province Name (full name) [Some-State]:uk
Locality Name (eg, city) []:London
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Homehapp
Organizational Unit Name (eg, section) []:Development
Common Name (e.g. server FQDN or YOUR name) []:*.homehapp.com
Email Address []:hostmaster@homehapp.com
```

## To Create .pem -file

Append following files together:

* star_homehapp_com.crt
* DigiCertCA.crt

cat star_homehapp_com.crt >> star_homehapp_com.pem && cat DigiCertCA.crt >> star_homehapp_com.pem

Create the DHE Parameter:

```sh
openssl dhparam -out star_homehapp_com_dhp.pem 2048
```

lb-production-ip-common: 107.178.243.133

# Create Cluster

./support/production/createCluster.sh admin

# Setup Load Balancing

gcloud compute addresses create lb-production-ip-common --global

Find instance group name:

```sh
gcloud compute instance-groups managed list --project $PROJECT_ID | awk '{print $1}' | grep "admin-prod"
```

Create HTTP Health checks:

```sh
gcloud compute http-health-checks create http-basic-check
```

Add named port to instance group:

```sh
gcloud compute instance-groups managed set-named-ports gke-homehapp-admin-prod-5652e395-group \
--named-ports http:80
```

Create Backend Service:

```sh
gcloud compute backend-services create admin-be-service \
  --protocol HTTP --http-health-check http-basic-check
```

Add Instance groups to backend service

```sh
gcloud compute backend-services add-backend admin-be-service \
--balancing-mode UTILIZATION --max-utilization 0.8 \
--capacity-scaler 1 --instance-group gke-homehapp-admin-prod-5652e395-group
```

Create a URL map:

```sh
gcloud compute url-maps create www-map \
--default-service admin-be-service
```

Add a path matcher to URL map and define request path mappings:

```sh
gcloud compute url-maps add-path-matcher www-map \
--default-service admin-be-service --path-matcher-name pathmap \
--path-rules=/admin=admin-be-service
```

Create target HTTP Proxy to route requests to URL Map:

```sh
gcloud compute target-http-proxies create http-lb-proxy \
--url-map www-map
```

Get Load Balancer static IP address:

```sh
gcloud compute addresses list | grep "lb-production-ip-common" | awk '{print $2}'
```

Create a global forwarding rule:

```sh
gcloud compute forwarding-rules create http-app-gfr \
--address 107.178.243.133 --global \
--target-http-proxy http-lb-proxy --port-range 80
```

## Create self-signed certificate for testing

Create the private key:

```sh
mkdir -p certs/selfsigned
cd certs/selfsigned
openssl genrsa -out homehapp.key 2048
```

Create Certificate Signing Request:

```sh
openssl req -new -key homehapp.key -out homehapp.csr
```
-> FI
-> Uusimaa
-> Helsinki
-> Qvik Oy
-> Development
-> homehapp.qvik.fi
-> jerry@qvik.fi
-> hhcertificate1

Create the Self-Signed Certificate:

```sh
openssl x509 -req -days 365 -in homehapp.csr -signkey homehapp.key -out homehapp.crt
```

Upload Certificate to Google Cloud:

```sh
export RESOURCE_NAME=hhsscert
gcloud beta compute ssl-certificates create $RESOURCE_NAME --certificate homehapp.crt \
--private-key homehapp.key
```

To remove certificate:

```sh
gcloud beta compute ssl-certificates delete $RESOURCE_NAME
```
