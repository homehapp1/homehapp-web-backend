#! /bin/sh

# Do not change these
REV=`git rev-parse --short HEAD`
CWD=`pwd`
CONTAINER_REGISTRY_HOST=eu.gcr.io
ENV=$1

function printUsage() {
  echo "Required environment variables:"
  echo "  PROJECT_ID:     Google Project ID"
  echo ""
  echo "Usage PROJECT_NAME=name ./support/updateCluster.sh [stg,prod]"
}
function printUsageAndExit() {
  printUsage
  exit
}

if [ "$PROJECT_ID" = "" ]; then
  echo "No Google Project ID defined!"
  printUsageAndExit
fi

if [ "$PROJECT_NAME" = "" ]; then
  echo "No project defined!"
  printUsageAndExit
fi

echo "Updating Cluster Pods for project '$PROJECT_NAME' to revision $REV for environment $ENV"

# Arguments:
# envName: Enum(prod, stg)
function updateCluster() {
  kubectl rolling-update "$PROJECT_NAME-controller" --image="$CONTAINER_REGISTRY_HOST/$PROJECT_ID/$PROJECT_NAME:$REV-$1"
}

updateCluster $ENV
