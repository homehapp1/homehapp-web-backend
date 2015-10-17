#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
ENV="prod"
PNAME="$1-$ENV"
PBNAME="$1"
CERT_PATH_PREFIX=$2
CLUSTER_NAME="homehapp-$1-$ENV"
CLUSTER_GOOGLE_NAME=""
NODE_GOOGLE_NAME=""

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_ID=id ./support/production/createCluster.sh [project_name] [path_to_cert(-extension)]"
  echo "Add -d for dry-run"
}
function printUsageAndExit() {
  printUsage
  exit
}

if [ "$PROJECT_ID" = "" ]; then
  echo "No Google Project ID defined!"
  printUsageAndExit
fi

if [ "$PNAME" = "" ]; then
  echo "No project defined!"
  printUsageAndExit
fi

if [ ! -d "$CWD/tmp" ]; then
  mkdir "$CWD/tmp"
fi

function createCluster() {
  if [ "$1" = "-d" ]; then
    echo "Execute: 'gcloud beta container clusters create $CLUSTER_NAME --num-nodes 1 --machine-type n1-standard-1 --project $PROJECT_ID'"
  else
    gcloud beta container clusters create $CLUSTER_NAME --num-nodes 1 --machine-type n1-standard-1 --project $PROJECT_ID
    CLUSTER_GOOGLE_NAME=`kubectl config view | grep $PROJECT_ID | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
    NODE_GOOGLE_NAME=`kubectl get nodes --context=$CLUSTER_GOOGLE_NAME | awk '{print $1}' | tail -n 1`
    local len=${#NODE_GOOGLE_NAME}
    NODE_GOOGLE_NAME=${NODE_GOOGLE_NAME:0:$((len-5))}
  fi
}

function setContext() {
  if [ "$CLUSTER_GOOGLE_NAME" = "" ]; then
    CLUSTER_GOOGLE_NAME=`kubectl config view | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
  fi

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl config use-context $CLUSTER_GOOGLE_NAME'"
  else
    kubectl config use-context $CLUSTER_GOOGLE_NAME
  fi
}

function createController() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/prod/project-controller-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-controller.json"
  local TMP_FILE="/tmp/$PNAME-controller.json"

  sed "s/:PROJECT_NAME/$PNAME/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROJECT_BASE_NAME/$PBNAME/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:PROJECT_ID/$PROJECT_ID/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:CONTROLLER_NAME/$PNAME-controller-$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:REV/$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:ENV/$ENV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl create -f $CWD/tmp/$PNAME-controller.json'"
  else
    kubectl create -f "$CWD/tmp/$PNAME-controller.json"
    rm $TARGET_CONFIG
  fi
}

function createService() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/prod/project-service-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-service.json"
  local TMP_FILE="/tmp/$PNAME-service.json"

  sed "s/:PROJECT_NAME/$PNAME/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROJECT_ID/$PROJECT_ID/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl create -f $CWD/tmp/$PNAME-service.json'"
  else
    kubectl create -f "$CWD/tmp/$PNAME-service.json"
    rm $TARGET_CONFIG
  fi
}

function createProxySecret() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/prod/proxy-secret-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-proxy-secret.json"
  local TMP_FILE="/tmp/$PNAME-proxy-secret.json"

  local PROXY_CERT=`base64 -i $CERT_PATH_PREFIX.pem`
  local PROXY_KEY=`base64 -i $CERT_PATH_PREFIX.key`
  local PROXY_DHP=`base64 -i ${CERT_PATH_PREFIX}_dhp.pem`

  sed "s/:PROXY_CERT/$PROXY_CERT/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROXY_KEY/$PROXY_KEY/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:PROXY_DHP/$PROXY_DHP/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl create -f $CWD/tmp/$PNAME-proxy-secret.json'"
  else
    kubectl create -f "$CWD/tmp/$PNAME-proxy-secret.json"
    rm $TARGET_CONFIG
  fi
}

function createProxyController() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/prod/proxy-controller-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-proxy-controller.json"
  local TMP_FILE="/tmp/$PNAME-proxy-controller.json"
  local UC_PNAME=`echo "${PBNAME}_${ENV}" | awk '{print toupper($0)}'`

  local SERVICE_HOST="${UC_PNAME}_SERVICE_HOST"
  local SERVICE_PORT="${UC_PNAME}_SERVICE_PORT_ENDPOINT"

  sed "s/:PROJECT_NAME/$PNAME-proxy/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROJECT_ID/$PROJECT_ID/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:CONTROLLER_NAME/$PNAME-proxy-controller-$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:REV/$REV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:ENV/$ENV/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:SERVICE_HOST/$SERVICE_HOST/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG
  sed "s/:SERVICE_PORT/$SERVICE_PORT/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl create -f $CWD/tmp/$PNAME-proxy-controller.json'"
  else
    kubectl create -f "$CWD/tmp/$PNAME-proxy-controller.json"
    rm $TARGET_CONFIG
  fi
}

function createProxyService() {
  local SOURCE_CONFIG="$CWD/infrastructure/configs/prod/proxy-service-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-proxy-service.json"
  local TMP_FILE="/tmp/$PNAME-proxy-service.json"

  sed "s/:PROJECT_NAME/$PNAME-proxy/g" $SOURCE_CONFIG > $TARGET_CONFIG
  sed "s/:PROJECT_ID/$PROJECT_ID/g" $TARGET_CONFIG > $TMP_FILE && mv $TMP_FILE $TARGET_CONFIG

  if [ "$1" = "-d" ]; then
    echo "Execute: 'kubectl create -f $CWD/tmp/$PNAME-proxy-service.json'"
  else
    kubectl create -f "$CWD/tmp/$PNAME-proxy-service.json"
    rm $TARGET_CONFIG
  fi
}

function configureProxyFirewall() {
  if [ "$1" = "-d" ]; then
    echo "Execute: 'gcloud compute firewall-rules create ${CLUSTER_NAME}-web-public --allow TCP:80,TCP:443 --source-ranges 0.0.0.0/0 --target-tags gke-${CLUSTER_NAME}-node'"
  else
    gcloud compute firewall-rules create ${CLUSTER_NAME}-web-public --project $PROJECT_ID --allow TCP:80,TCP:443 --source-ranges 0.0.0.0/0 --target-tags gke-${CLUSTER_NAME}-node
  fi
}

function tagClusterNodes() {
  if [ "$1" = "-d" ]; then
    echo "Execute: 'gcloud compute instances add-tags {} --project $PROJECT_ID --tags gke-${CLUSTER_NAME}-node'"
  else
    gcloud compute instances list --project $PROJECT_ID -r "^gke-${CLUSTER_NAME}.*node.*$" | tail -n +2 | cut -f1 -d' ' | xargs -L 1 -I '{}' gcloud compute instances add-tags {} --project $PROJECT_ID --tags gke-${CLUSTER_NAME}-node
  fi
}

if [ "$3" = "-d" ]; then
  echo "In Dry-Run mode"
fi

echo "Creating Container Cluster $CLUSTER_NAME"
echo ""

createCluster $3
setContext $3

echo ""
echo "Creating Replication Controller $PNAME-controller"

createController $3

echo ""
echo "Creating Service $PNAME-service"

createService $3

echo ""
echo "Creating Proxy Secret $PNAME-proxy-secret"

createProxySecret $3

echo ""
echo "Creating Proxy Replication Controller $PNAME-proxy-controller"

createProxyController $3

echo ""
echo "Creating Proxy Service $PNAME-proxy-service"

createProxyService $3

echo ""
echo "Tagging Cluster nodes for $CLUSTER_NAME"

tagClusterNodes $3

echo ""
echo "Configuring Firewall for $PNAME-proxy"

configureProxyFirewall $3

echo ""
echo "Cluster created!"
echo ""

if [ "$3" = "" ]; then
  echo "Execute following script after few minutes to find out the external IP."
  echo "kubectl describe services $PNAME-proxy --context=$CLUSTER_GOOGLE_NAME | grep 'LoadBalancer Ingress'"
fi
