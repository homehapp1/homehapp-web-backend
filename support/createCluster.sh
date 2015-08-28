#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
PNAME=$1
ENV=$2
CLUSTER_NAME="homehapp-$PNAME-$ENV"
CLUSTER_GOOGLE_NAME=""
NODE_GOOGLE_NAME=""

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_ID=id ./support/createCluster.sh [project_name] [stg,prod]"
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
    echo "Execute: 'gcloud beta container clusters create $CLUSTER_NAME --num-nodes 1 --machine-type g1-small --project $PROJECT_ID'"
  else
    gcloud beta container clusters create $CLUSTER_NAME --num-nodes 1 --machine-type g1-small --project $PROJECT_ID
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
  local SOURCE_CONFIG="$CWD/infrastructure/configs/project-controller-tpl.json"
  local TARGET_CONFIG="$CWD/tmp/$PNAME-controller.json"
  local TMP_FILE="/tmp/$PNAME-controller.json"

  sed "s/:PROJECT_NAME/$PNAME/g" $SOURCE_CONFIG > $TARGET_CONFIG
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
  local SOURCE_CONFIG="$CWD/infrastructure/configs/project-service-tpl.json"
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

# function openFirewall() {
#   if [ "$CLUSTER_GOOGLE_NAME" = "" ]; then
#     CLUSTER_GOOGLE_NAME=`kubectl config view | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
#   fi
#   if [ "$NODE_GOOGLE_NAME" = "" ]; then
#     NODE_GOOGLE_NAME=`kubectl get nodes --context=$CLUSTER_GOOGLE_NAME | awk '{print $1}' | tail -n 1`
#     local len=${#NODE_GOOGLE_NAME}
#     NODE_GOOGLE_NAME=${NODE_GOOGLE_NAME:0:$((len-5))}
#   fi
#
#   if [ "$1" = "-d" ]; then
#     echo "Execute: 'gcloud compute firewall-rules create $PNAME-8080 --allow tcp:8080 --target-tags $NODE_GOOGLE_NAME --project $PROJECT_ID"
#   else
#     gcloud compute firewall-rules create $PNAME-8080 --allow tcp:8080 --target-tags $NODE_GOOGLE_NAME --project $PROJECT_ID
#   fi
# }

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

# echo ""
# echo "Opening firewall for service"
#
# openFirewall $3

echo ""
echo "Cluster created!"
echo ""

if [ "$3" = "" ]; then
  echo "Execute following script after few minutes to find out the external IP."
  echo "kubectl describe services $PNAME --context=$CLUSTER_GOOGLE_NAME | grep 'LoadBalancer Ingress'"
fi
