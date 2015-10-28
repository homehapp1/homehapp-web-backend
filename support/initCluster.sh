#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
ENV=$1
CLUSTER_NAME="homehapp-$ENV"
CLUSTER_GOOGLE_NAME=""

NUM_NODES=2
MACHINE_TYPE="n1-standard-1"

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_ID=id ./support/initCluster.sh [stg,prod]"
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

if [ "$ENV" = "" ]; then
  echo "No environment defined!"
  printUsageAndExit
fi

if [ ! -d "$CWD/tmp" ]; then
  mkdir "$CWD/tmp"
fi

if [ "$ENV" = "prod" ]; then
  MACHINE_TYPE="n1-standard-2"
fi

function createCluster() {
  if [ "$1" = "-d" ]; then
    echo "Execute: 'gcloud beta container clusters create $CLUSTER_NAME --num-nodes $NUM_NODES --machine-type $MACHINE_TYPE --project $PROJECT_ID'"
  else
    gcloud beta container clusters create $CLUSTER_NAME --num-nodes $NUM_NODES --machine-type $MACHINE_TYPE --project $PROJECT_ID
    echo "Execute: kubectl config view | grep $PROJECT_ID | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1"
    CLUSTER_GOOGLE_NAME=`kubectl config view | grep $PROJECT_ID | awk '{print $2}' | grep $CLUSTER_NAME | tail -n 1`
    echo "CLUSTER_GOOGLE_NAME: $CLUSTER_GOOGLE_NAME"
  fi
}

if [ "$2" = "-d" ]; then
  echo "In Dry-Run mode"
fi

echo "Creating Container Cluster $CLUSTER_NAME"
echo ""

createCluster $2

echo ""
echo "Cluster created!"
echo ""
